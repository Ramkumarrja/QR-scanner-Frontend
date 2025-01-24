// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//     "https://cdqchpzmkaghgvllxhvt.supabase.co",
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkcWNocHpta2FnaGd2bGx4aHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNTY4OTMsImV4cCI6MjA1MjkzMjg5M30.2ZlRs_7ZPkh4cZHSKAIdcdh91XJspXB4CbwadcCEyUw"
// )




// export default  supabase



// import { useEffect, useState } from "react";
// import supabase from "./lib/helper/supabaseClient";
// import { User } from "@supabase/supabase-js";

// const App = () => {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const {
//         data: { session },
//         error,
//       } = await supabase.auth.getSession();

//       if (error) {
//         console.log("Error ::", error);
//       }
//       console.log("user ::", session?.user);
//       setUser(session?.user ?? null);
//     };
//     fetchUser();
//   }, []);

//   const handleLogin = async () => {
//     const { data, error } = await supabase.auth.signInWithOAuth({
//       provider: "github",
//     });
//     console.log(data, error);
//   };

//   const handleLogOut = async () => {
//     const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
//     if (sessionError || !sessionData.session) {
//       console.error("Session missing or invalid:", sessionError || "No session data");
//       return;
//     }
  
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) {
//         console.error("Logout Error ::", error);
//       } else {
//         console.log("Successfully logged out");
//         setUser(null);
//       }
//     } catch (err) {
//       console.error("Unexpected logout error:", err);
//     }
//   };
  
  

//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center"
//       }}
//     >
//       {user ? (
//         <>
//           {" "}
//           <h1> Authenticated </h1>
//           <button onClick={handleLogOut}> LogOut</button>
//         </>
//       ) : (
//         <>
//           <button onClick={handleLogin}>GitHub Login</button>
//         </>
//       )}
//     </div>
//   );
// };

// export default App;
