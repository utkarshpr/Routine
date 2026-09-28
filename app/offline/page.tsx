export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">You&rsquo;re offline.</h1>
      <p className="mt-2 max-w-xs text-sm text-muted">
        Routine needs to load once while online before this page is available offline. Your existing routines,
        habits, and tasks are still saved on this device.
      </p>
    </div>
  );
}
