"""
BlueBridge – Daraja M-Pesa STK Push backend (sandbox)
------------------------------------------------------
Set these environment variables before running in production:
  DARAJA_CONSUMER_KEY
  DARAJA_CONSUMER_SECRET
  DARAJA_SHORTCODE
  DARAJA_PASSKEY
  DARAJA_CALLBACK_URL   (must be a public HTTPS URL Safaricom can reach)

For sandbox testing the built-in sandbox test credentials are pre-filled.
Use ngrok or a similar tunnel to expose localhost for the callback.
"""

import os
import base64
import requests as http
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask import Response

app = Flask(__name__, static_folder=".")
app.config["JSON_SORT_KEYS"] = False

# ── Daraja Sandbox credentials (swap env vars for production) ────────────────
CONSUMER_KEY    = os.environ.get("DARAJA_CONSUMER_KEY",    "YOUR_CONSUMER_KEY")
CONSUMER_SECRET = os.environ.get("DARAJA_CONSUMER_SECRET", "YOUR_CONSUMER_SECRET")
SHORTCODE       = os.environ.get("DARAJA_SHORTCODE",       "174379")
PASSKEY         = os.environ.get("DARAJA_PASSKEY",
    "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919")
CALLBACK_URL    = os.environ.get("DARAJA_CALLBACK_URL",
    "https://YOUR_NGROK_URL/api/mpesa/callback")

DARAJA_BASE = "https://sandbox.safaricom.co.ke"

# In-memory payment status store  {CheckoutRequestID: {status, resultCode, resultDesc}}
_payments: dict = {}


# ── Helpers ──────────────────────────────────────────────────────────────────

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
    """Accepts 07XXXXXXXX, 2547XXXXXXXX, +2547XXXXXXXX → 2547XXXXXXXX"""
    phone = phone.strip().replace(" ", "").replace("+", "").replace("-", "")
    if phone.startswith("0"):
        phone = "254" + phone[1:]
    return phone


# ── Static file serving ───────────────────────────────────────────────────────

@app.route("/")
def index():
    return send_from_directory(".", "Ston_website_V2.html")


@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(".", path)


# ── Daraja API endpoints ──────────────────────────────────────────────────────

@app.route("/api/mpesa/stkpush", methods=["POST"])
def stk_push():
    data = request.get_json(force=True) or {}
    phone  = _normalize_phone(data.get("phone", ""))
    amount = max(1, int(data.get("amount", 1)))
    desc   = (data.get("description") or "BlueBridge Payment")[:13]  # max 13 chars

    if not phone:
        return jsonify({"error": "Phone number is required"}), 400

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    password  = base64.b64encode(
        f"{SHORTCODE}{PASSKEY}{timestamp}".encode()
    ).decode()

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
        resp = http.post(
            f"{DARAJA_BASE}/mpesa/stkpush/v1/processrequest",
            json=payload,
            headers={"Authorization": f"Bearer {token}"},
            timeout=30,
        )
        result = resp.json()
        cid = result.get("CheckoutRequestID")
        if cid:
            _payments[cid] = {"status": "pending"}
        return jsonify(result), resp.status_code

    except http.exceptions.RequestException as e:
        return jsonify({"error": f"Network error: {e}"}), 502
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/mpesa/callback", methods=["POST"])
def mpesa_callback():
    """Safaricom posts the STK Push result here."""
    body = request.get_json(force=True) or {}
    try:
        stk = body["Body"]["stkCallback"]
        cid  = stk["CheckoutRequestID"]
        code = stk["ResultCode"]
        _payments[cid] = {
            "status":     "success" if code == 0 else "failed",
            "resultCode": code,
            "resultDesc": stk.get("ResultDesc", ""),
        }
    except (KeyError, TypeError):
        pass  # malformed callback – ignore silently
    return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"})


@app.route("/api/mpesa/status/<checkout_id>")
def payment_status(checkout_id):
    """Frontend polls this to learn if payment succeeded."""
    return jsonify(_payments.get(checkout_id, {"status": "pending"}))


# ── Run ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("\n  BlueBridge dev server: http://localhost:5000")
    print("  M-Pesa STK Push: sandbox mode")
    print("  Set DARAJA_* env vars to customise credentials.\n")
    app.run(port=5000, debug=True, use_reloader=True)
