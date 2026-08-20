import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import courseRoutes from './routes/course.routes.js';
import sectionRoutes from './routes/section.routes.js';
import enrollmentRoutes from './routes/enrollment.routes.js';
import lessonRoutes from './routes/lesson.routes.js';
const app = express();



app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/sections/:sectionId/lessons', lessonRoutes);
export default app;