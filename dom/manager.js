const database = {
    users: [
        { id: 1, name: 'Admin', role: 'admin', email: 'admin@school.com', password: 'admin123' },
        { id: 2, name: 'Teacher1', role: 'teacher', email: 'teacher1@school.com', password: 'teacher123' },
        { id: 3, name: 'Student1', role: 'student', email: 'student1@school.com', password: 'student123' }
    ],
    classrooms: [
        { id: 101, name: '自习室101', capacity: 30, status: 'available' },
        { id: 102, name: '自习室102', capacity: 40, status: 'available' },
        { id: 201, name: '自习室201', capacity: 25, status: 'maintenance' }
    ],
    reservations: [
        { id: 1, userId: 3, classroomId: 101, date: '2023-06-15', time: '09:00-12:00', status: 'approved' }
    ]
};
class AdminManager {
  constructor(db) {
      this.db = db;
  }
  
  // 1. 用户管理
  getAllUsers() {
      return this.db.users;
  }
  
  addUser(user) {
      const newUser = {
          id: this.db.users.length + 1,
          ...user
      };
      this.db.users.push(newUser);
      return newUser;
  }
  
  updateUser(id, updates) {
      const userIndex = this.db.users.findIndex(u => u.id === id);
      if (userIndex === -1) return null;
      
      this.db.users[userIndex] = { ...this.db.users[userIndex], ...updates };
      return this.db.users[userIndex];
  }
  
  deleteUser(id) {
      const userIndex = this.db.users.findIndex(u => u.id === id);
      if (userIndex === -1) return false;
      
      this.db.users.splice(userIndex, 1);
      return true;
  }
  
  // 2. 自习室管理
  getAllClassrooms() {
      return this.db.classrooms;
  }
  
  addClassroom(classroom) {
      const newClassroom = {
          id: this.db.classrooms.length + 100 + 1,
          ...classroom
      };
      this.db.classrooms.push(newClassroom);
      return newClassroom;
  }
  
  updateClassroom(id, updates) {
      const classroomIndex = this.db.classrooms.findIndex(c => c.id === id);
      if (classroomIndex === -1) return null;
      
      this.db.classrooms[classroomIndex] = { 
          ...this.db.classrooms[classroomIndex], 
          ...updates 
      };
      return this.db.classrooms[classroomIndex];
  }
  
  deleteClassroom(id) {
      const classroomIndex = this.db.classrooms.findIndex(c => c.id === id);
      if (classroomIndex === -1) return false;
      
      this.db.classrooms.splice(classroomIndex, 1);
      return true;
  }
  
  // 3. 预约管理
  getAllReservations() {
      return this.db.reservations;
  }
  
  getReservationById(id) {
      return this.db.reservations.find(r => r.id === id);
  }
  
  updateReservationStatus(id, status) {
      const reservationIndex = this.db.reservations.findIndex(r => r.id === id);
      if (reservationIndex === -1) return null;
      
      this.db.reservations[reservationIndex].status = status;
      return this.db.reservations[reservationIndex];
  }
  
  deleteReservation(id) {
      const reservationIndex = this.db.reservations.findIndex(r => r.id === id);
      if (reservationIndex === -1) return false;
      
      this.db.reservations.splice(reservationIndex, 1);
      return true;
  }
  
  // 4. 系统统计
  getSystemStats() {
      return {
          totalUsers: this.db.users.length,
          totalTeachers: this.db.users.filter(u => u.role === 'teacher').length,
          totalStudents: this.db.users.filter(u => u.role === 'student').length,
          totalClassrooms: this.db.classrooms.length,
          availableClassrooms: this.db.classrooms.filter(c => c.status === 'available').length,
          totalReservations: this.db.reservations.length,
          approvedReservations: this.db.reservations.filter(r => r.status === 'approved').length,
          pendingReservations: this.db.reservations.filter(r => r.status === 'pending').length
      };
  }
}