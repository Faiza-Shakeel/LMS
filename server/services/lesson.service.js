import { supabaseAdmin } from '../config/supabaseClient.js';

/**
 * Creates a lesson under a section. If no position is supplied, it's
 * placed after the current last lesson in that section, so callers
 * don't have to compute ordering themselves for the common "add to
 * the end" case.
 */
export async function createLesson(sectionId, { title, description, videoUrl, duration, position, isPreview }) {
    let resolvedPosition = position;

    if (resolvedPosition === undefined) {
        const { data: lastLesson } = await supabaseAdmin
            .from('lessons')
            .select('position')
            .eq('section_id', sectionId)
            .order('position', { ascending: false })
            .limit(1)
            .maybeSingle();

        resolvedPosition = lastLesson ? lastLesson.position + 1 : 0;
    }

    const { data, error } = await supabaseAdmin
        .from('lessons')
        .insert({
            section_id: sectionId,
            title,
            description: description ?? null,
            video_url: videoUrl ?? null,
            duration: duration ?? null,
            position: resolvedPosition,
            is_preview: isPreview ?? false,
        })
        .select()
        .single();

    if (error) {
        if (error.code === '23505') {
            const err = new Error('A lesson already exists at that position in this section');
            err.status = 409;
            throw err;
        }
        throw error;
    }

    return data;
}

export async function getLessonsBySection(sectionId) {
    const { data, error } = await supabaseAdmin
        .from('lessons')
        .select('id, title, description, video_url, duration, position, is_preview, created_at, updated_at')
        .eq('section_id', sectionId)
        .order('position', { ascending: true });

    if (error) throw error;
    return data;
}

export async function updateLesson(lessonId, updates) {
    const { data, error } = await supabaseAdmin
        .from('lessons')
        .update(updates)
        .eq('id', lessonId)
        .select()
        .single();

    if (error) {
        if (error.code === '23505') {
            const err = new Error('A lesson already exists at that position in this section');
            err.status = 409;
            throw err;
        }
        throw error;
    }

    return data;
}

export async function deleteLesson(lessonId) {
    const { error } = await supabaseAdmin.from('lessons').delete().eq('id', lessonId);
    if (error) throw error;
}