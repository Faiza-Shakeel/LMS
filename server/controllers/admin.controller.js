import * as authService from '../services/auth.service.js';

// const VALID_ROLES = ['admin', 'instructor', 'student'];
export async function createInstructor(req, res, next) {
    try {
        const {
            email,
            password,
            firstName,
            lastName,
        } = req.body;

        if (
            !email ||
            !password ||
            !firstName ||
            !lastName
        ) {
            return res.status(400).json({
                message: 'All fields are required.',
            });
        }

        const instructor =
            await authService.createInstructor({
                email,
                password,
                firstName,
                lastName,
            });

        return res.status(201).json({
            message: 'Instructor created successfully.',
            instructor,
        });
    } catch (err) {
        next(err);
    }
}

// /**
//  * PATCH /api/admin/users/:userId/role
//  * Body: { role: 'admin' | 'instructor' | 'student' }
//  * Restricted to admins via the authorize('admin') middleware on the route.
//  */
// export async function changeUserRole(req, res, next) {
//     try {
//         const { userId } = req.params;
//         const { role } = req.body;

//         if (!VALID_ROLES.includes(role)) {
//             return res.status(400).json({ error: `role must be one of: ${VALID_ROLES.join(', ')}` });
//         }

//         const updated = await authService.updateUserRole(userId, role);

//         res.status(200).json({
//             message: `Role updated to '${role}'`,
//             user: updated,
//         });
//     } catch (err) {
//         next(err);
//     }
// }