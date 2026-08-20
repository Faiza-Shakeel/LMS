import { useState } from 'react';
import { ChevronDown, PlayCircle, Lock } from 'lucide-react';

function formatDuration(seconds) {
    if (!seconds) return null;
    return `${Math.round(seconds / 60)} min`;
}

/**
 * First section starts open (typical "preview the first module" UX),
 * the rest collapsed. Locked (non-preview) lessons show a lock icon
 * rather than being hidden entirely — the student can see the full
 * shape of the course before enrolling, just not access the content.
 */
export default function CurriculumAccordion({ sections }) {
    const [openId, setOpenId] = useState(sections?.[0]?.id ?? null);

    if (!sections?.length) {
        return <p className="text-sm text-ink-muted">No curriculum has been published yet.</p>;
    }

    return (
        <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
            {sections.map((section) => {
                const isOpen = openId === section.id;
                return (
                    <div key={section.id}>
                        <button
                            onClick={() => setOpenId(isOpen ? null : section.id)}
                            className="flex w-full items-center justify-between px-5 py-4 text-left"
                        >
                            <div>
                                <p className="text-sm font-semibold text-ink">{section.title}</p>
                                <p className="text-xs text-ink-muted">
                                    {section.lessons?.length ?? 0} lessons
                                </p>
                            </div>
                            <ChevronDown
                                size={18}
                                className={`text-ink-faint transition-transform ${
                                    isOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {isOpen && (
                            <div className="border-t border-border bg-bg/50 px-5 py-2">
                                {section.lessons?.map((lesson) => (
                                    <div
                                        key={lesson.id}
                                        className="flex items-center justify-between py-2.5"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            {lesson.is_preview ? (
                                                <PlayCircle size={16} className="text-primary" />
                                            ) : (
                                                <Lock size={14} className="text-ink-faint" />
                                            )}
                                            <span className="text-sm text-ink">{lesson.title}</span>
                                            {lesson.is_preview && (
                                                <span className="text-xs font-medium text-primary">
                                                    Preview
                                                </span>
                                            )}
                                        </div>
                                        {formatDuration(lesson.duration) && (
                                            <span className="text-xs text-ink-muted">
                                                {formatDuration(lesson.duration)}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}