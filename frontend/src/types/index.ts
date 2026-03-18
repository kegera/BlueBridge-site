export interface User {
  id: number
  email: string
  full_name: string
  role: 'student' | 'instructor'
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Option {
  id: number
  body: string
  is_correct?: boolean   // only visible to instructor
  order_index: number
}

export interface Question {
  id: number
  test_id: number
  body: string
  question_type: 'mcq' | 'open'
  order_index: number
  points: number
  options: Option[]
}

export interface Test {
  id: number
  title: string
  description: string
  exam_type: 'IELTS' | 'TOEFL' | 'PTE' | 'General'
  time_limit: number | null
  is_published: boolean
  created_by: number
  created_at: string
  question_count?: number
  questions?: Question[]
}

export interface Answer {
  id: number
  submission_id: number
  question_id: number
  selected_option_id: number | null
  open_text: string | null
  is_correct: boolean | null
  points_awarded: number | null
  instructor_comment: string | null
  question?: Question
  selected_option?: Option
}

export interface Submission {
  id: number
  test_id: number
  student_id: number
  started_at: string
  submitted_at: string | null
  status: 'in_progress' | 'submitted' | 'graded'
  mcq_score: number
  open_score: number | null
  total_score: number | null
  max_score: number
  test_title?: string
  student_name?: string
  answers?: Answer[]
}

export interface CartItem {
  id: string
  title: string
  category: string
  format: string
  price: number
  qty: number
}

export interface InstructorAnalytics {
  total_tests: number
  total_submissions: number
  graded_submissions: number
  pending_grading: number
  tests: Array<{
    test_id: number
    title: string
    submission_count: number
    avg_total_score: number
    avg_pct: number
  }>
}

export interface StudentAnalytics {
  tests_taken: number
  avg_score_pct: number
  history: Array<{
    test_title: string
    exam_type: string
    submitted_at: string
    total_score: number
    max_score: number
    pct: number
    status: string
  }>
}
