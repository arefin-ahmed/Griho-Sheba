# Griho Sheba — Reorganized Project

This delivers the exact folder structure you specified:

```
griho_sheba/
├── frontend/   (React + Vite)
├── backend/    (Java / Spring Boot)
└── database/
    └── schema.sql
```

**Frontend**
- `Navbar.jsx`, `Footer.jsx`, `Login.jsx`, `Register.jsx`, `AdminDashboard.jsx` — carried over as-is.
- `Dashboard.jsx` (which handled both roles) was split into `CustomerDashboard.jsx` and `WorkerDashboard.jsx` per your tree.
- `Hero.jsx`, `ServiceCategories.jsx`, `WorkerList.jsx`, `ServiceCatalog.jsx`, `Testimonials.jsx` were folded into `Home.jsx`, since your tree lists a single `Home.jsx` page rather than separate section components.
- `WorkerCard.jsx` and `ServiceCard.jsx` are new reusable presentational components extracted from that markup.
- `BookingForm.jsx` became `Booking.jsx`.
- `Payment.jsx` and `Profile.jsx` are new — your original project didn't have these pages yet, so they're built to match the app's existing style and API conventions.

**Backend**
- `User.java`, `Booking.java`, `Service.java`, `UserRepository.java`, `BookingRepository.java` — carried over as-is.
- `Worker.java` → renamed `DomesticWorker.java` (per your tree); `WorkerRepository.java` updated to match.
- `Customer.java` and `Admin.java` are new. Your original app stores every account (customer, worker, admin) in one `users` table distinguished by a `role` column — so these two are lightweight, non-persisted views over `User`, not duplicate database tables. This is called out in a comment in each file.
- `Payment.java`, `Complaint.java`, `Review.java` are new JPA entities — used by the new Payment/Profile/complaint flows on the frontend.
- **New service layer** (`AuthService`, `BookingService`, `WorkerService`, `PaymentService`): your original controllers talked to repositories directly. Since your tree calls for a `service/` layer, this logic was extracted out of the controllers into services, and the controllers now delegate to them.
- `UserController.java` was split into `AuthController.java` (register/login/profile) and `AdminController.java` (approvals, user list, complaints), matching your tree.
- `database/DatabaseConnection.java` is a new raw-JDBC helper class. Note: your actual persistence runs through Spring Data JPA (see `application.properties`), not this class — it's included because your tree asked for it, with a comment explaining the relationship.
- `Main.java` — renamed from `GrihoshebaApplication.java`.

**Added but not in your original tree (needed for the backend to actually build/run):**
- `backend/pom.xml` — Maven build file.
- `backend/application.properties` — datasource config matching `schema.sql`.

These two also include a note: the backend files here are laid out flat (`backend/controller`, `backend/model`, etc.) to match your requested tree, but a real Maven build expects them nested under `src/main/java/com/project/grihosheba/...`. The package declarations in every `.java` file are already correct for that layout — you'd just need to move the folders before running `mvn spring-boot:run`.

## Database
`database/schema.sql` is a PostgreSQL schema mirroring every JPA entity, including the foreign keys between `bookings`, `payments`, `complaints`, `reviews`, and the `users`/`workers` tables.
