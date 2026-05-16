# PixelCast
A Weather app that feels like opening a save file in an old adventure game.

## Project Goals

### Rust goals

- Read and write types — Get comfortable with struct, enum, Option, Result, and serde so JSON from a weather API maps cleanly into Rust types.
- One happy-path command — Implement a single #[tauri::command] like get_forecast(city: String) -> Result<ForecastDto, String> (or a structured error type later). Practice returning errors with ? instead of panicking.
- ? and map_err — Learn to propagate errors from reqwest, parsing, etc., and turn them into something the UI can display.
- Ownership at the boundary — Notice where you need &str vs String; for v1, using String in command args is fine and reduces friction.
- Avoid scope creep in Rust — Defer traits, generics-heavy APIs, and async runtimes beyond what Tauri already gives you until the first command works end-to-end.

### UI goals

- Mock the screen first — Static or fake weather data in React so you can nail layout and the “save file / CRT” feel before Rust does real HTTP.
- One invoke path — Swap mock data for invoke("get_forecast", …) once; handle loading and error in the UI explicitly.
- Desktop polish basics — Resize behavior, readable contrast, keyboard focus on inputs.