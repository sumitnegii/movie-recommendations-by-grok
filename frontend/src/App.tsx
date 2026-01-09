import { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [movies, setMovies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const recommend = async () => {
  if (!input.trim()) return;

  setLoading(true);
  setError("");
  setMovies([]);

  try {
    // local host delere after render
    const res = await fetch( //  render 
      "https://movie-recommendations-by-grok.onrender.com/recommend",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      }
    );

    const data = await res.json(); // res exists now from no ]w
    setMovies(data.recommendations);
  } catch {
    setError("Failed to fetch recommendations. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const quickExamples = [
    "action movies with strong female lead",
    "90s romantic comedies",
  ];

  return (

      <div className="flex w-screen h-screen bg-slate-900 text-slate-100 overflow-hidden">

      {/* lleft reccomnd  sec */}
     <div className="flex-1 flex flex-col overflow-y-auto">
      <header className="text-center py-10 border-b border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
        <p className="text-slate-400 text-lg">
             movie recommendations by grok
          </p>
        </header>

        {/* Main */}
        <main className="max-w-3xl mx-auto p-2 w-full">
          {/* Search Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl mb-8 py-5">
            <h2 className="text-2xl font-semibold mb-6">
              What are you in the mood for?
            </h2>

            <div className="flex gap-3 mb-6">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && recommend()}
                placeholder="Describe your movie preferences..."
                disabled={loading}
                className="flex-1 px-5 py-4 rounded-xl bg-slate-900 border-2 border-slate-600 focus:outline-none focus:border-blue-500"
              />

              <button
                onClick={recommend}
                disabled={loading || !input.trim()}
                className="px-8 py-4 rounded-xl bg-blue-500 font-semibold flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? "Searching..." : "Find Movies"}
              </button>
            </div>

            {/* Examples */}
            <p className="text-slate-400 text-sm mb-3">Try these examples:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickExamples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setInput(example)}
                  className="text-left px-4 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition"
                >
                  {example}
                </button>
              ))}
            </div>

            {error && (
              <div className="mt-6 bg-red-900/40 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
                 {error}
              </div>
            )}
          </div>

          {/* Results */}
          {movies.length > 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  Your Recommendations ({movies.length})
                </h3>
                <button
                  onClick={() => setMovies([])}
                  className="text-sm px-4 py-2 border border-slate-600 rounded-lg text-slate-400 "
                >

                  Clear All
                </button>
              </div>

              <div className="space-y-4">
                {movies.map((movie, index) => (
                  <div
                    key={index}
                    className="flex gap-4 bg-slate-900 border border-slate-700 rounded-xl p-5"
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center font-bold ">
                      {index + 1}
                    </div>

                    <div className="flex-1 ">
                      <h4 className="font-semibold mb-3">{movie}</h4>
                      <div className="flex gap-3 flex-wrap text-black">
                        <button
                          onClick={() =>
                            window.open(
                              `https://www.themoviedb.org/search?query=${encodeURIComponent(
                                movie
                              )}`,
                              "_blank"
                            )
                          }
                          className="px-4 py-2 text-sm border border-slate-600 rounded-lg hover:bg-slate-800 hover:text-red-600"
                        >
                          Search TMDB
                        </button>
                        <button
                          onClick={() =>
                            window.open(
                              `https://www.google.com/search?q=${encodeURIComponent(
                                movie + " movie"
                              )}`,
                              "_blank"
                            )
                          }
                          className="px-4 py-2 text-sm border border-slate-600 rounded-lg hover:bg-slate-800 hover:text-red-600"
                        >
                          Search Web
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && movies.length === 0 && !error && (
            <div className="text-center text-slate-400 mt-16">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-xl mb-2 text-slate-300">No movies yet</h3>
              <p>
                Describe what you want to watch or try an example above.
              </p>
            </div>
          )}

          {loading && (
            <div className="text-center mt-16">
              <div className="w-14 h-14 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-300">
                Analyzing your preferences…
                <br />
                <span className="text-slate-400 text-sm">
                  Finding the perfect matches
                </span>
              </p>
            </div>
          )}
        </main>
      </div>

      {/* rigthhh poster section */}
      <div className="w-1/2 relative overflow-hidden">
        <img
          src="/poster.png"
          alt="AI robot watching movies with popcorn"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <p className="absolute bottom-6 w-full text-center text-gray-300 italic text-lg">
          I don’t watch movies. I analyze them.
        </p>
      </div>



{/* debug  */}
      {/* <div>
        console.log(data.recommendations);
      </div> */}

     
    </div>


    
  
  );
}
