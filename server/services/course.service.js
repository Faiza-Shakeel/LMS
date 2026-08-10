import { supabaseAdmin } from '../config/supabaseClient.js';

export async function createCourse({ instructorId, categoryId, title, slug, description, level }) {
    const { data, error } = await supabaseAdmin
        .from('courses')
        .insert({
            instructor_id: instructorId,
            category_id: categoryId ?? null,
            title,
            slug,
            description: description ?? null,
            level: level ?? 'beginner',
        })
        .select()
        .single();

    if (error){
throw error;
console.error('Error creating course:', error);
    } ;
   
    return data;
}

export async function listCoursesForInstructor(instructorId) {
    const { data, error } = await supabaseAdmin
        .from('courses')
        .select('*')
        .eq('instructor_id', instructorId)
        .order('created_at', { ascending: false });

    if (error){
throw error;
console.error('Error listing courses for instructor:', error);
    } 
    return data;
}



export async function updateCourse(courseId, updates) {
    const { data, error } = await supabaseAdmin
        .from('courses')
        .update(updates)
        .eq('id', courseId)
        .select()
        .single();

    if (error){
throw error;
console.error('Error updating course:', error);
    } ;
    return data;
}

export async function deleteCourse(courseId) {
    const { error } = await supabaseAdmin.from('courses').delete().eq('id', courseId);
    if (error) {
        throw error;
        console.error('Error deleting course:', error);
    }
}

export async function createSection(courseId, { title, position }) {
    const { data, error } = await supabaseAdmin
        .from('sections')
        .insert({ course_id: courseId, title, position: position ?? 0 })
        .select()
        .single();

    if (error) {
        throw error;
        console.error('Error creating section:', error);
    }
    return data;
}