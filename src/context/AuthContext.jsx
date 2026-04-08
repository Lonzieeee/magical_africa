import { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage'


import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut 
} from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

/*

const firebaseConfig = {
  apiKey: "AIzaSyDiLg6P5650fOfcS8Wq5J3-x9qkgKFrc4Y",
  authDomain: "magicalafrica-e7287.firebaseapp.com",
  projectId: "magicalafrica-e7287",
  storageBucket: "magicalafrica-e7287.firebasestorage.app",
  messagingSenderId: "941072590474",
  appId: "1:941072590474:web:8b7683d28111c850676f73"
};




const firebaseConfig = {
  apiKey: "AIzaSyBzFOh8x4TL_EYLQLmlZSFL_X9RZbkpSbY",
  authDomain: "magicalafrica2-7df93.firebaseapp.com",
  projectId: "magicalafrica2-7df93",
  storageBucket: "magicalafrica2-7df93.firebasestorage.app",
  messagingSenderId: "1080318233292",
  appId: "1:1080318233292:web:6f9071b061e3d6ea139069"
};




const firebaseConfig = {
  apiKey: "AIzaSyAsLzEIcsuF6Aoou861ee4TDNJCi0F5hRI",
  authDomain: "magicalafrica3.firebaseapp.com",
  projectId: "magicalafrica3",
  storageBucket: "magicalafrica3.firebasestorage.app",
  messagingSenderId: "943918113486",
  appId: "1:943918113486:web:fade750f9b2e4d9107269f"
};
*/



const firebaseConfig = {
  apiKey: "AIzaSyBeoF3S6T10L7bpCDRJDoY3FnRtM8htPYU",
  authDomain: "magicalafrica4.firebaseapp.com",
  projectId: "magicalafrica4",
  storageBucket: "magicalafrica4.firebasestorage.app",
  messagingSenderId: "714238762756",
  appId: "1:714238762756:web:c99eea60c5293592e5ba51"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);        // ✅ added export
export const db = getFirestore(app);     // ✅ added export
export const storage = getStorage(app)   // same Firebase app instance
/*
const auth = getAuth(app);
const db = getFirestore(app);
*/
const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUserDoc = null

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc()
        unsubscribeUserDoc = null
      }

      setUser(currentUser);
      
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid)
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          setUserData(null)
        }

        unsubscribeUserDoc = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.data())
          } else {
            setUserData(null)
          }
        })
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => {
      if (unsubscribeUserDoc) unsubscribeUserDoc()
      unsubscribe();
    }
  }, []);

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password, additionalData) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      ...additionalData,
      email: email,
      authProvider: "email",
      createdAt: new Date().toISOString()
    });

    return userCredential;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      const names = user.displayName ? user.displayName.split(' ') : ['', ''];
      
      await setDoc(doc(db, "users", user.uid), {
        firstName: names[0] || "",
        lastName: names.slice(1).join(' ') || "",
        email: user.email,
        photoURL: user.photoURL || "",
        authProvider: "google",
        createdAt: new Date().toISOString()
      });
    }

    return result;
  };

  const logout = async () => {
    return signOut(auth);
  };

  const getInitials = () => {
    if (userData) {
      const firstName = userData.firstName || "";
      const lastName = userData.lastName || userData.secondName || "";
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    }
    if (user?.displayName) {
      const names = user.displayName.split(' ');
      return names.map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
    }
    return "";
  };

  const getFullName = () => {
    if (userData) {
      return `${userData.firstName || ""} ${userData.lastName || userData.secondName || ""}`.trim();
    }
    return user?.displayName || "";
  };

  const value = {
    user,
    userData,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    getInitials,
    getFullName
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
