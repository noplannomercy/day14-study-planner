import { getSubjects } from '@/actions/subjects';
import { getStudySessions } from '@/actions/sessions';
import { SubjectForm } from '@/components/subjects/subject-form';
import { SubjectList } from '@/components/subjects/subject-list';
import { SessionForm } from '@/components/sessions/session-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function Home() {
  const subjectsResult = await getSubjects();
  const sessionsResult = await getStudySessions();

  const subjects = subjectsResult.success && subjectsResult.data ? subjectsResult.data : [];
  const sessions = sessionsResult.success && sessionsResult.data ? sessionsResult.data : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">AI Study Planner</h1>
          <p className="text-muted-foreground mt-1">
            Track your learning progress and optimize with AI
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="subjects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="sessions">Study Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="subjects" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <SubjectForm />
              <SubjectList subjects={subjects} />
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            {subjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Please create a subject first before logging study sessions.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                <SessionForm subjects={subjects} />
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Recent Sessions</h2>
                  {sessions.length === 0 ? (
                    <p className="text-muted-foreground">No study sessions yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {sessions.slice(0, 10).map((session) => {
                        const subject = subjects.find((s) => s.id === session.subjectId);
                        return (
                          <div
                            key={session.id}
                            className="p-4 bg-white rounded-lg border"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {subject && (
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: subject.color }}
                                />
                              )}
                              <span className="font-medium">{subject?.name || 'Unknown'}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Duration: {session.durationMinutes} min | Comprehension: {session.comprehension}/5
                            </div>
                            {session.notes && (
                              <p className="text-sm mt-2">{session.notes}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
