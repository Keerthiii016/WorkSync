# WorkSync - Project & Task Management Application

A comprehensive project and task management application built with HTML, CSS, JavaScript frontend and Java Spring Boot backend.

## 🚀 Features

### Core Features
- **User Authentication**: Registration, login/logout with JWT tokens
- **Projects Dashboard**: Create, view, edit, and delete projects
- **Task Management**: Add, edit, delete tasks with status tracking
- **Responsive UI**: Modern, mobile-friendly interface with Bootstrap

### Intermediate Features
- **Task Priority & Deadlines**: High/Medium/Low priority with due dates
- **Search & Filter**: Search tasks and filter by status/priority
- **Dashboard Analytics**: Project and task statistics with charts
- **Task Comments**: Add notes and updates to tasks

### Advanced Features
- **Team Collaboration**: Share projects with team members
- **Kanban Board**: Drag & drop task management
- **Email Notifications**: Task due alerts and project invites
- **Dark Mode**: Theme toggle with local storage persistence

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5, Chart.js
- **Backend**: Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA
- **Database**: MySQL (Primary), MongoDB (Optional)
- **Authentication**: JWT tokens
- **Real-time**: WebSocket
- **Email**: Spring Mail

## 📦 Installation

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Node.js (for frontend development server)

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd WorkSync
```

2. Configure database in `src/main/resources/application.properties`:
```properties
# MySQL Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/worksync
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT Configuration
jwt.secret=your_jwt_secret_here
jwt.expiration=604800000

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

3. Build and run the backend:
```bash
mvn clean install
mvn spring-boot:run
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Start the development server:
```bash
# Using Python (if available)
python -m http.server 3000

# Or using Node.js
npx http-server -p 3000
```

<!--The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080-->

## 📁 Project Structure


WorkSync/
├── src/
│   ├── main/
│   │   ├── java/com/worksync/
│   │   │   ├── controller/     # REST controllers
│   │   │   ├── service/        # Business logic
│   │   │   ├── repository/     # Data access layer
│   │   │   ├── model/          # Entity classes
│   │   │   ├── dto/            # Data transfer objects
│   │   │   ├── config/         # Configuration classes
│   │   │   ├── security/       # Security configuration
│   │   │   └── util/           # Utility classes
│   │   └── resources/
│   │       ├── static/         # Static files (HTML, CSS, JS)
│   │       └── application.properties
│   └── test/                   # Test files
├── frontend/                   # Frontend files
│   ├── css/                   # Stylesheets
│   ├── js/                    # JavaScript files
│   ├── images/                # Images and icons
│   └── index.html             # Main HTML file
├── pom.xml                    # Maven configuration
└── README.md
```

## 🎯 Usage

1. **Register/Login**: Create an account or sign in
2. **Create Projects**: Add new projects with descriptions
3. **Manage Tasks**: Create tasks, set priorities, and track progress
4. **Collaborate**: Invite team members to projects
5. **Track Progress**: Use the dashboard to monitor project statistics

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update user profile

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project by ID
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get task by ID
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License. 