"""
BlueBridge – Full-Stack Backend
---------------------------------
M-Pesa STK Push + Auth + Test/Submission/Analytics APIs

Environment variables (production):
  DARAJA_CONSUMER_KEY, DARAJA_CONSUMER_SECRET
  DARAJA_SHORTCODE, DARAJA_PASSKEY
  DARAJA_CALLBACK_URL   (public HTTPS URL for Safaricom callback)
  SECRET_KEY            (JWT signing secret)
"""

import os
import base64
import json
import requests as http
from datetime import datetime, timedelta, timezone
from functools import wraps

import bcrypt
import jwt
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# ── App setup ────────────────────────────────────────────────────────────────

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, "frontend", "dist")
app = Flask(__name__, static_folder=None)
app.config["JSON_SORT_KEYS"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///bluebridge.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
SECRET_KEY = os.environ.get("SECRET_KEY", "bb-dev-secret-change-in-production")

CORS(app, resources={r"/api/*": {"origins": "*"}})
db = SQLAlchemy(app)

# ── Daraja credentials ────────────────────────────────────────────────────────

CONSUMER_KEY    = os.environ.get("DARAJA_CONSUMER_KEY",    "YOUR_CONSUMER_KEY")
CONSUMER_SECRET = os.environ.get("DARAJA_CONSUMER_SECRET", "YOUR_CONSUMER_SECRET")
SHORTCODE       = os.environ.get("DARAJA_SHORTCODE",       "174379")
PASSKEY         = os.environ.get("DARAJA_PASSKEY",
    "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919")
CALLBACK_URL    = os.environ.get("DARAJA_CALLBACK_URL",
    "https://YOUR_NGROK_URL/api/mpesa/callback")
DARAJA_BASE     = "https://sandbox.safaricom.co.ke"

# In-memory payment status store  {CheckoutRequestID: {...}}
_payments: dict = {}


# ── Models ────────────────────────────────────────────────────────────────────

class User(db.Model):
    __tablename__ = "users"
    id           = db.Column(db.Integer, primary_key=True)
    email        = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name    = db.Column(db.String(255), nullable=False)
    role         = db.Column(db.String(20), nullable=False, default="student")  # student|instructor
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {"id": self.id, "email": self.email, "full_name": self.full_name, "role": self.role}


class Test(db.Model):
    __tablename__ = "tests"
    id           = db.Column(db.Integer, primary_key=True)
    title        = db.Column(db.String(255), nullable=False)
    description  = db.Column(db.Text, default="")
    exam_type    = db.Column(db.String(20), default="General")
    time_limit   = db.Column(db.Integer, nullable=True)
    is_published = db.Column(db.Boolean, default=False)
    created_by   = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)
    questions    = db.relationship("Question", backref="test", cascade="all, delete-orphan",
                                   order_by="Question.order_index")

    def to_dict(self, include_questions=False, for_student=False):
        d = {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "exam_type": self.exam_type,
            "time_limit": self.time_limit,
            "is_published": self.is_published,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat(),
            "question_count": len(self.questions),
        }
        if include_questions:
            d["questions"] = [q.to_dict(for_student=for_student) for q in self.questions]
        return d


class Question(db.Model):
    __tablename__ = "questions"
    id            = db.Column(db.Integer, primary_key=True)
    test_id       = db.Column(db.Integer, db.ForeignKey("tests.id"), nullable=False)
    body          = db.Column(db.Text, nullable=False)
    question_type = db.Column(db.String(10), nullable=False, default="mcq")  # mcq|open
    order_index   = db.Column(db.Integer, default=0)
    points        = db.Column(db.Integer, default=1)
    options       = db.relationship("Option", backref="question", cascade="all, delete-orphan",
                                    order_by="Option.order_index")

    def to_dict(self, for_student=False):
        d = {
            "id": self.id,
            "test_id": self.test_id,
            "body": self.body,
            "question_type": self.question_type,
            "order_index": self.order_index,
            "points": self.points,
            "options": [o.to_dict(for_student=for_student) for o in self.options],
        }
        return d


class Option(db.Model):
    __tablename__ = "options"
    id          = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey("questions.id"), nullable=False)
    body        = db.Column(db.Text, nullable=False)
    is_correct  = db.Column(db.Boolean, default=False)
    order_index = db.Column(db.Integer, default=0)

    def to_dict(self, for_student=False):
        d = {"id": self.id, "body": self.body, "order_index": self.order_index}
        if not for_student:
            d["is_correct"] = self.is_correct
        return d


class Submission(db.Model):
    __tablename__ = "submissions"
    id           = db.Column(db.Integer, primary_key=True)
    test_id      = db.Column(db.Integer, db.ForeignKey("tests.id"), nullable=False)
    student_id   = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    started_at   = db.Column(db.DateTime, default=datetime.utcnow)
    submitted_at = db.Column(db.DateTime, nullable=True)
    status       = db.Column(db.String(20), default="in_progress")  # in_progress|submitted|graded
    mcq_score    = db.Column(db.Integer, default=0)
    open_score   = db.Column(db.Integer, nullable=True)
    total_score  = db.Column(db.Integer, nullable=True)
    max_score    = db.Column(db.Integer, default=0)
    answers      = db.relationship("Answer", backref="submission", cascade="all, delete-orphan")

    def to_dict(self, include_answers=False):
        test = Test.query.get(self.test_id)
        student = User.query.get(self.student_id)
        d = {
            "id": self.id,
            "test_id": self.test_id,
            "student_id": self.student_id,
            "started_at": self.started_at.isoformat(),
            "submitted_at": self.submitted_at.isoformat() if self.submitted_at else None,
            "status": self.status,
            "mcq_score": self.mcq_score,
            "open_score": self.open_score,
            "total_score": self.total_score,
            "max_score": self.max_score,
            "test_title": test.title if test else None,
            "student_name": student.full_name if student else None,
        }
        if include_answers:
            d["answers"] = [a.to_dict() for a in self.answers]
        return d


class Answer(db.Model):
    __tablename__ = "answers"
    id                 = db.Column(db.Integer, primary_key=True)
    submission_id      = db.Column(db.Integer, db.ForeignKey("submissions.id"), nullable=False)
    question_id        = db.Column(db.Integer, db.ForeignKey("questions.id"), nullable=False)
    selected_option_id = db.Column(db.Integer, db.ForeignKey("options.id"), nullable=True)
    open_text          = db.Column(db.Text, nullable=True)
    is_correct         = db.Column(db.Boolean, nullable=True)
    points_awarded     = db.Column(db.Integer, nullable=True)
    instructor_comment = db.Column(db.Text, nullable=True)

    def to_dict(self):
        q = Question.query.get(self.question_id)
        opt = Option.query.get(self.selected_option_id) if self.selected_option_id else None
        return {
            "id": self.id,
            "submission_id": self.submission_id,
            "question_id": self.question_id,
            "selected_option_id": self.selected_option_id,
            "open_text": self.open_text,
            "is_correct": self.is_correct,
            "points_awarded": self.points_awarded,
            "instructor_comment": self.instructor_comment,
            "question": q.to_dict() if q else None,
            "selected_option": opt.to_dict() if opt else None,
        }


class Order(db.Model):
    __tablename__ = "orders"
    id                  = db.Column(db.Integer, primary_key=True)
    user_id             = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    checkout_request_id = db.Column(db.String(100), unique=True, nullable=True)
    items_json          = db.Column(db.Text, default="[]")
    total_kes           = db.Column(db.Integer, default=0)
    phone               = db.Column(db.String(20), nullable=True)
    status              = db.Column(db.String(20), default="pending")  # pending|success|failed
    result_desc         = db.Column(db.Text, nullable=True)
    created_at          = db.Column(db.DateTime, default=datetime.utcnow)


# ── Auth helpers ──────────────────────────────────────────────────────────────

def _make_token(user: User) -> str:
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "exp": datetime.now(timezone.utc) + timedelta(days=30),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def require_auth(role=None):
    """Decorator: verifies Bearer JWT, sets request.user_id and request.user_role."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization", "")
            if not auth_header.startswith("Bearer "):
                return jsonify({"error": "Unauthorized"}), 401
            token = auth_header[7:]
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token expired"}), 401
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token"}), 401
            request.user_id = int(payload["sub"])
            request.user_role = payload["role"]
            if role and request.user_role != role:
                return jsonify({"error": "Forbidden"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator


# ── Daraja helpers ────────────────────────────────────────────────────────────

def _access_token() -> str:
    creds = base64.b64encode(f"{CONSUMER_KEY}:{CONSUMER_SECRET}".encode()).decode()
    resp = http.get(
        f"{DARAJA_BASE}/oauth/v1/generate?grant_type=client_credentials",
        headers={"Authorization": f"Basic {creds}"},
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json()["access_token"]


def _normalize_phone(phone: str) -> str:
    phone = phone.strip().replace(" ", "").replace("+", "").replace("-", "")
    if phone.startswith("0"):
        phone = "254" + phone[1:]
    return phone


# ── Static file serving ───────────────────────────────────────────────────────

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_spa(path):
    if path.startswith("api/"):
        return jsonify({"error": "Not found"}), 404
    # Try to serve as a static file first
    if path:
        file_path = os.path.join(DIST_DIR, path)
        if os.path.isfile(file_path):
            return send_from_directory(DIST_DIR, path)
    # SPA fallback: serve index.html for all routes
    index_path = os.path.join(DIST_DIR, "index.html")
    if os.path.isfile(index_path):
        return send_from_directory(DIST_DIR, "index.html")
    # Dev fallback: serve old HTML site when dist doesn't exist
    return send_from_directory(BASE_DIR, "Ston_website_V2.html")


# ── Auth endpoints ────────────────────────────────────────────────────────────

@app.route("/api/auth/register", methods=["POST"])
def auth_register():
    data = request.get_json(force=True) or {}
    email     = (data.get("email") or "").strip().lower()
    password  = data.get("password") or ""
    full_name = (data.get("full_name") or "").strip()
    role      = data.get("role", "student")

    if not email or not password or not full_name:
        return jsonify({"error": "email, password and full_name are required"}), 400
    if role not in ("student", "instructor"):
        role = "student"
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    user = User(email=email, password_hash=pw_hash, full_name=full_name, role=role)
    db.session.add(user)
    db.session.commit()
    return jsonify({"token": _make_token(user), "user": user.to_dict()}), 201


@app.route("/api/auth/login", methods=["POST"])
def auth_login():
    data = request.get_json(force=True) or {}
    email    = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        return jsonify({"error": "Invalid credentials"}), 401
    return jsonify({"token": _make_token(user), "user": user.to_dict()})


@app.route("/api/auth/me")
@require_auth()
def auth_me():
    user = User.query.get(request.user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict())


# ── Tests CRUD ────────────────────────────────────────────────────────────────

@app.route("/api/tests", methods=["GET"])
@require_auth()
def list_tests():
    if request.user_role == "instructor":
        tests = Test.query.filter_by(created_by=request.user_id).order_by(Test.created_at.desc()).all()
    else:
        tests = Test.query.filter_by(is_published=True).order_by(Test.created_at.desc()).all()
    return jsonify([t.to_dict() for t in tests])


@app.route("/api/tests", methods=["POST"])
@require_auth(role="instructor")
def create_test():
    data = request.get_json(force=True) or {}
    test = Test(
        title=data.get("title", "Untitled Test"),
        description=data.get("description", ""),
        exam_type=data.get("exam_type", "General"),
        time_limit=data.get("time_limit"),
        created_by=request.user_id,
    )
    db.session.add(test)
    db.session.commit()
    return jsonify(test.to_dict(include_questions=True)), 201


@app.route("/api/tests/<int:tid>", methods=["GET"])
@require_auth()
def get_test(tid):
    test = Test.query.get_or_404(tid)
    if not test.is_published and request.user_role == "student":
        return jsonify({"error": "Not found"}), 404
    for_student = (request.user_role == "student")
    return jsonify(test.to_dict(include_questions=True, for_student=for_student))


@app.route("/api/tests/<int:tid>", methods=["PUT"])
@require_auth(role="instructor")
def update_test(tid):
    test = Test.query.get_or_404(tid)
    if test.created_by != request.user_id:
        return jsonify({"error": "Forbidden"}), 403
    data = request.get_json(force=True) or {}
    for field in ("title", "description", "exam_type", "time_limit"):
        if field in data:
            setattr(test, field, data[field])
    db.session.commit()
    return jsonify(test.to_dict(include_questions=True))


@app.route("/api/tests/<int:tid>", methods=["DELETE"])
@require_auth(role="instructor")
def delete_test(tid):
    test = Test.query.get_or_404(tid)
    if test.created_by != request.user_id:
        return jsonify({"error": "Forbidden"}), 403
    db.session.delete(test)
    db.session.commit()
    return jsonify({"ok": True})


@app.route("/api/tests/<int:tid>/publish", methods=["PATCH"])
@require_auth(role="instructor")
def publish_test(tid):
    test = Test.query.get_or_404(tid)
    if test.created_by != request.user_id:
        return jsonify({"error": "Forbidden"}), 403
    data = request.get_json(force=True) or {}
    test.is_published = data.get("is_published", not test.is_published)
    db.session.commit()
    return jsonify(test.to_dict())


# ── Questions CRUD ────────────────────────────────────────────────────────────

@app.route("/api/tests/<int:tid>/questions", methods=["POST"])
@require_auth(role="instructor")
def add_question(tid):
    test = Test.query.get_or_404(tid)
    if test.created_by != request.user_id:
        return jsonify({"error": "Forbidden"}), 403
    data = request.get_json(force=True) or {}
    q = Question(
        test_id=tid,
        body=data.get("body", ""),
        question_type=data.get("question_type", "mcq"),
        order_index=data.get("order_index", len(test.questions)),
        points=data.get("points", 1),
    )
    db.session.add(q)
    db.session.flush()
    for i, opt in enumerate(data.get("options", [])):
        db.session.add(Option(
            question_id=q.id,
            body=opt.get("body", ""),
            is_correct=opt.get("is_correct", False),
            order_index=i,
        ))
    db.session.commit()
    return jsonify(q.to_dict()), 201


@app.route("/api/questions/<int:qid>", methods=["PUT"])
@require_auth(role="instructor")
def update_question(qid):
    q = Question.query.get_or_404(qid)
    test = Test.query.get(q.test_id)
    if not test or test.created_by != request.user_id:
        return jsonify({"error": "Forbidden"}), 403
    data = request.get_json(force=True) or {}
    for field in ("body", "question_type", "order_index", "points"):
        if field in data:
            setattr(q, field, data[field])
    if "options" in data:
        # Replace all options
        Option.query.filter_by(question_id=qid).delete()
        for i, opt in enumerate(data["options"]):
            db.session.add(Option(
                question_id=qid,
                body=opt.get("body", ""),
                is_correct=opt.get("is_correct", False),
                order_index=i,
            ))
    db.session.commit()
    return jsonify(q.to_dict())


@app.route("/api/questions/<int:qid>", methods=["DELETE"])
@require_auth(role="instructor")
def delete_question(qid):
    q = Question.query.get_or_404(qid)
    test = Test.query.get(q.test_id)
    if not test or test.created_by != request.user_id:
        return jsonify({"error": "Forbidden"}), 403
    db.session.delete(q)
    db.session.commit()
    return jsonify({"ok": True})


# ── Submissions ───────────────────────────────────────────────────────────────

@app.route("/api/submissions", methods=["POST"])
@require_auth(role="student")
def start_submission():
    data = request.get_json(force=True) or {}
    test_id = data.get("test_id")
    test = Test.query.filter_by(id=test_id, is_published=True).first()
    if not test:
        return jsonify({"error": "Test not found or not published"}), 404

    # Resume in-progress
    existing = Submission.query.filter_by(
        test_id=test_id, student_id=request.user_id, status="in_progress"
    ).first()
    if existing:
        return jsonify({"submission_id": existing.id, "test": test.to_dict(include_questions=True, for_student=True)})

    max_score = sum(q.points for q in test.questions)
    sub = Submission(test_id=test_id, student_id=request.user_id, max_score=max_score)
    db.session.add(sub)
    db.session.commit()
    return jsonify({"submission_id": sub.id, "test": test.to_dict(include_questions=True, for_student=True)}), 201


@app.route("/api/submissions/<int:sid>/submit", methods=["POST"])
@require_auth(role="student")
def submit_submission(sid):
    sub = Submission.query.get_or_404(sid)
    if sub.student_id != request.user_id:
        return jsonify({"error": "Forbidden"}), 403
    if sub.status != "in_progress":
        return jsonify({"error": "Already submitted"}), 400

    data = request.get_json(force=True) or {}
    answers_data = data.get("answers", [])  # [{question_id, selected_option_id, open_text}]

    mcq_score = 0
    has_open = False
    max_score = 0

    for ans_data in answers_data:
        q = Question.query.get(ans_data.get("question_id"))
        if not q or q.test_id != sub.test_id:
            continue
        max_score += q.points
        ans = Answer(
            submission_id=sid,
            question_id=q.id,
            selected_option_id=ans_data.get("selected_option_id"),
            open_text=ans_data.get("open_text"),
        )
        if q.question_type == "mcq" and ans_data.get("selected_option_id"):
            opt = Option.query.get(ans_data["selected_option_id"])
            if opt and opt.is_correct:
                ans.is_correct = True
                ans.points_awarded = q.points
                mcq_score += q.points
            else:
                ans.is_correct = False
                ans.points_awarded = 0
        elif q.question_type == "open":
            has_open = True
        db.session.add(ans)

    sub.mcq_score = mcq_score
    sub.submitted_at = datetime.utcnow()
    sub.max_score = max_score

    if not has_open:
        sub.total_score = mcq_score
        sub.status = "graded"
    else:
        sub.status = "submitted"

    db.session.commit()
    return jsonify(sub.to_dict())


@app.route("/api/submissions", methods=["GET"])
@require_auth()
def list_submissions():
    if request.user_role == "instructor":
        subs = Submission.query.join(Test).filter(
            Test.created_by == request.user_id
        ).order_by(Submission.submitted_at.desc()).all()
    else:
        subs = Submission.query.filter_by(student_id=request.user_id).order_by(
            Submission.started_at.desc()
        ).all()
    return jsonify([s.to_dict() for s in subs])


@app.route("/api/submissions/<int:sid>", methods=["GET"])
@require_auth()
def get_submission(sid):
    sub = Submission.query.get_or_404(sid)
    if request.user_role == "student" and sub.student_id != request.user_id:
        return jsonify({"error": "Forbidden"}), 403
    return jsonify(sub.to_dict(include_answers=True))


@app.route("/api/submissions/<int:sid>/grade", methods=["PATCH"])
@require_auth(role="instructor")
def grade_submission(sid):
    sub = Submission.query.get_or_404(sid)
    test = Test.query.get(sub.test_id)
    if not test or test.created_by != request.user_id:
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json(force=True) or {}
    open_score = data.get("open_score", 0)
    comments   = data.get("comments", {})  # {answer_id: comment_text}

    for ans_id_str, comment in comments.items():
        ans = Answer.query.get(int(ans_id_str))
        if ans and ans.submission_id == sid:
            ans.instructor_comment = comment

    sub.open_score   = open_score
    sub.total_score  = (sub.mcq_score or 0) + open_score
    sub.status       = "graded"
    db.session.commit()
    return jsonify(sub.to_dict(include_answers=True))


# ── Analytics ─────────────────────────────────────────────────────────────────

@app.route("/api/analytics/instructor")
@require_auth(role="instructor")
def instructor_analytics():
    tests = Test.query.filter_by(created_by=request.user_id).all()
    test_ids = [t.id for t in tests]
    subs = Submission.query.filter(Submission.test_id.in_(test_ids)).all() if test_ids else []

    per_test = []
    for t in tests:
        t_subs = [s for s in subs if s.test_id == t.id]
        graded = [s for s in t_subs if s.status == "graded" and s.total_score is not None]
        avg_score = (sum(s.total_score for s in graded) / len(graded)) if graded else 0
        max_s = t_subs[0].max_score if t_subs else 0
        avg_pct = (avg_score / max_s * 100) if max_s else 0
        per_test.append({
            "test_id": t.id,
            "title": t.title,
            "submission_count": len(t_subs),
            "avg_total_score": round(avg_score, 1),
            "avg_pct": round(avg_pct, 1),
        })

    return jsonify({
        "total_tests": len(tests),
        "total_submissions": len(subs),
        "graded_submissions": sum(1 for s in subs if s.status == "graded"),
        "pending_grading": sum(1 for s in subs if s.status == "submitted"),
        "tests": per_test,
    })


@app.route("/api/analytics/student")
@require_auth(role="student")
def student_analytics():
    subs = Submission.query.filter_by(student_id=request.user_id).order_by(
        Submission.submitted_at.desc()
    ).all()

    graded = [s for s in subs if s.status == "graded" and s.total_score is not None and s.max_score]
    avg_pct = (sum(s.total_score / s.max_score * 100 for s in graded) / len(graded)) if graded else 0

    history = []
    for s in subs:
        test = Test.query.get(s.test_id)
        history.append({
            "test_title": test.title if test else f"Test #{s.test_id}",
            "exam_type": test.exam_type if test else "General",
            "submitted_at": s.submitted_at.isoformat() if s.submitted_at else s.started_at.isoformat(),
            "total_score": s.total_score or 0,
            "max_score": s.max_score or 0,
            "pct": round((s.total_score / s.max_score * 100) if (s.total_score and s.max_score) else 0, 1),
            "status": s.status,
        })

    return jsonify({
        "tests_taken": len(subs),
        "avg_score_pct": round(avg_pct, 1),
        "history": history,
    })


# ── M-Pesa endpoints ──────────────────────────────────────────────────────────

@app.route("/api/mpesa/stkpush", methods=["POST"])
def stk_push():
    data   = request.get_json(force=True) or {}
    phone  = _normalize_phone(data.get("phone", ""))
    amount = max(1, int(data.get("amount", 1)))
    desc   = (data.get("description") or "BlueBridge Payment")[:13]
    items  = data.get("items", [])

    if not phone:
        return jsonify({"error": "Phone number is required"}), 400

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    password  = base64.b64encode(f"{SHORTCODE}{PASSKEY}{timestamp}".encode()).decode()

    try:
        token = _access_token()
        payload = {
            "BusinessShortCode": SHORTCODE,
            "Password":          password,
            "Timestamp":         timestamp,
            "TransactionType":   "CustomerPayBillOnline",
            "Amount":            amount,
            "PartyA":            phone,
            "PartyB":            SHORTCODE,
            "PhoneNumber":       phone,
            "CallBackURL":       CALLBACK_URL,
            "AccountReference":  "BlueBridge",
            "TransactionDesc":   desc,
        }
        resp   = http.post(
            f"{DARAJA_BASE}/mpesa/stkpush/v1/processrequest",
            json=payload,
            headers={"Authorization": f"Bearer {token}"},
            timeout=30,
        )
        result = resp.json()
        cid    = result.get("CheckoutRequestID")
        if cid:
            _payments[cid] = {"status": "pending"}
            order = Order(
                checkout_request_id=cid,
                items_json=json.dumps(items),
                total_kes=amount,
                phone=phone,
                status="pending",
            )
            db.session.add(order)
            db.session.commit()
        return jsonify(result), resp.status_code

    except http.exceptions.RequestException as e:
        return jsonify({"error": f"Network error: {e}"}), 502
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/mpesa/callback", methods=["POST"])
def mpesa_callback():
    body = request.get_json(force=True) or {}
    try:
        stk  = body["Body"]["stkCallback"]
        cid  = stk["CheckoutRequestID"]
        code = stk["ResultCode"]
        status = "success" if code == 0 else "failed"
        desc   = stk.get("ResultDesc", "")

        _payments[cid] = {"status": status, "resultCode": code, "resultDesc": desc}

        order = Order.query.filter_by(checkout_request_id=cid).first()
        if order:
            order.status = status
            order.result_desc = desc
            db.session.commit()
    except (KeyError, TypeError):
        pass
    return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"})


@app.route("/api/mpesa/status/<checkout_id>")
def payment_status(checkout_id):
    return jsonify(_payments.get(checkout_id, {"status": "pending"}))


# ── Run ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    print("\n  BlueBridge dev server: http://localhost:5000")
    print("  Full-stack mode: React app + M-Pesa + Auth + Tests")
    print("  Set DARAJA_* and SECRET_KEY env vars for production.\n")
    app.run(port=5000, debug=True, use_reloader=True)
