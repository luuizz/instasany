export type Role = 'student' | 'admin'
export type RoleFilter = Role | 'all'

export type StudentListItem = {
  id: string
  name: string
  email: string
  role: Role
  createdAt: Date | null
  courses: number
  completedLessons: number
  totalLessons: number
  lastActivity: Date | null
}

export type StudentList = { items: StudentListItem[]; total: number; page: number; pageSize: number }

export type StudentCourseProgress = {
  id: number
  slug: string
  title: string
  enrolledAt: Date | null
  completed: number
  total: number
  lastCompletedAt: Date | null
  certificateCode: string | null
}

export type ActivityItem = {
  type: string
  path: string
  lessonTitle: string
  courseTitle: string
  createdAt: Date | null
}

export type StudentDetail = Omit<StudentListItem, 'courses' | 'completedLessons' | 'totalLessons'> & {
  watchedMinutes: number
  pageViews: number
  courses: StudentCourseProgress[]
  activity: ActivityItem[]
}
