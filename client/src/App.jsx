import { useHealth } from "./hooks/useHealth";

function App() {
  const { data, isLoading, isError } = useHealth();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="w-full max-w-xl px-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <h1 className="text-3xl font-bold">CodePulse</h1>

          <p className="mt-2 text-slate-400">
            Developer Productivity & Career Intelligence Platform
          </p>

          <div className="mt-8 rounded-xl bg-slate-800 p-5">
            <p className="text-sm text-slate-400">Backend Status</p>

            {isLoading && (
              <p className="mt-2 text-yellow-400">
                Connecting to backend...
              </p>
            )}

            {isError && (
              <p className="mt-2 text-red-400">
                Backend connection failed
              </p>
            )}

            {data && (
              <p className="mt-2 text-green-400">
                ● {data}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;