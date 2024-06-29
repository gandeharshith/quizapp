// // src/components/Login.js
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth, db } from '../firebaseConfig';
// import { doc, getDoc } from 'firebase/firestore';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('user');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError(''); // Clear previous error

//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Fetch user data from Firestore
//       const userDoc = await getDoc(doc(db, 'users', user.uid));
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         const userRole = userData.role;
//         const isVerified = userData.verified || user.emailVerified;

//         if (!isVerified) {
//           setError('Please verify your email before logging in.');
//           return;
//         }

//         if (userRole === 'admin' && role === 'admin') {
//           navigate('/admin');
//         } else if (userRole === 'user' && role === 'user') {
//           navigate('/user');
//         } else {
//           setError('Invalid role selection.');
//         }
//       } else {
//         setError('User data not found.');
//       }
//     } catch (error) {
//       if (error.code === 'auth/user-not-found') {
//         setError('No user found with this email.');
//       } else if (error.code === 'auth/wrong-password') {
//         setError('Incorrect password.');
//       } else if (error.code === 'auth/invalid-email') {
//         setError('Invalid email format.');
//       } else if (error.code === 'auth/invalid-credential') {
//         setError('Invalid credential.');
//       } else {
//         setError(`Login failed: ${error.message}`);
//       }
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <div>
//           <label>
//             <input
//               type="radio"
//               value="admin"
//               checked={role === 'admin'}
//               onChange={() => setRole('admin')}
//             />
//             Admin
//           </label>
//           <label>
//             <input
//               type="radio"
//               value="user"
//               checked={role === 'user'}
//               onChange={() => setRole('user')}
//             />
//             User
//           </label>
//         </div>
//         <button type="submit">Login</button>
//       </form>
//       {error && <p>{error}</p>}
//       <Link to="/signup">Sign Up</Link>
//     </div>
//   );
// };

// export default Login;



// src/components/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;
        const isVerified = userData.verified || user.emailVerified;

        if (!isVerified) {
          setError('Please verify your email before logging in.');
          return;
        }

        if (userRole === 'admin' && role === 'admin') {
          navigate('/admin');
        } else if (userRole === 'user' && role === 'user') {
          navigate('/user');
        } else {
          setError('Invalid role selection.');
        }
      } else {
        setError('User data not found.');
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setError('No user found with this email.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email format.');
      } else if (error.code === 'auth/invalid-credential') {
        setError('Invalid credential.');
      } else {
        setError(`Login failed: ${error.message}`);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-between">
            <label className="flex items-center">
              <input
                type="radio"
                value="admin"
                checked={role === 'admin'}
                onChange={() => setRole('admin')}
                className="form-radio"
              />
              <span className="ml-2">Admin</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="user"
                checked={role === 'user'}
                onChange={() => setRole('user')}
                className="form-radio"
              />
              <span className="ml-2">User</span>
            </label>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Login
          </button>
        </form>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        <Link to="/signup" className="block mt-4 text-center text-blue-500 hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
