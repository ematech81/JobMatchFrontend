export default function DecorativeBackground() {
    return (
      <>
        <div className="fixed top-0 right-0 -z-10 opacity-20 pointer-events-none">
          <div className="w-[500px] h-[500px] bg-electric-blue/10 blur-[100px] rounded-full" />
        </div>
        <div className="fixed bottom-0 left-0 -z-10 opacity-20 pointer-events-none">
          <div className="w-[400px] h-[400px] bg-tertiary-fixed/30 blur-[80px] rounded-full" />
        </div>
      </>
    );
  }