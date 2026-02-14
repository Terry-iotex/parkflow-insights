export function Footer() {
  return (
    <footer className="mt-8 py-6 border-t border-border/30 text-center space-y-1">
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span className="w-2 h-2 rounded-full bg-primary inline-block" />
        <span className="font-medium">Trio Vision Intelligence · OCS UI</span>
      </div>
      <p className="text-[10px] text-muted-foreground/60 max-w-lg mx-auto">
        Built for real-time operations: the goal isn't "watching cameras", it's turning vision into faster lines and safer parks.
      </p>
    </footer>
  );
}
