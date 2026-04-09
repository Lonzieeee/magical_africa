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

{/*
const firebaseConfig = {
  apiKey: "AIzaSyB2hbVH3VO0d8iVW1aI30cS2mZ2B-RtsjI",
  authDomain: "magical-africa.firebaseapp.com",
  projectId: "magical-africa",
  storageBucket: "magical-africa.firebasestorage.app",
  messagingSenderId: "558663634344",
  appId: "1:558663634344:web:beb8bb91f23fb19b80e19d",
  measurementId: "G-QQVLZH6BW6"
};
 */}


 const firebaseConfig = {
  apiKey: "AIzaSyCqbsYKijJzA97DT4G1t9VxzVG_1P0mK7U",
  authDomain: "magical-africa2.firebaseapp.com",
  projectId: "magical-africa2",
  storageBucket: "magical-africa2.firebasestorage.app",
  messagingSenderId: "652021159840",
  appId: "1:652021159840:web:a303a36a7c83ba5d84f6c5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app)

const googleProvider = new GoogleAuthProvider();
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUserDoc = null

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Clean up previous listener if user switched accounts
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc()
        unsubscribeUserDoc = null
      }

      setUser(currentUser)

      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid)

        // FIX: removed getDoc — onSnapshot fires immediately on connect
        // so we get the data in one read instead of two
        unsubscribeUserDoc = onSnapshot(
          userDocRef,
          (snapshot) => {
            if (snapshot.exists()) {
              setUserData(snapshot.data())
            } else {
              setUserData(null)
            }
            // Only set loading false after we have the user data
            setLoading(false)
          },
          (error) => {
            console.log('User profile listener error:', error)
            setUserData(null)
            setLoading(false)
          }
        )
      } else {
        setUserData(null)
        setLoading(false)
      }
    })

    return () => {
      if (unsubscribeUserDoc) unsubscribeUserDoc()
      unsubscribe()
    }
  }, []);

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password, additionalData) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), {
      ...additionalData,
      email: email,
      authProvider: 'email',
      createdAt: new Date().toISOString()
    });
    return userCredential;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      const names = user.displayName ? user.displayName.split(' ') : ['', ''];
      await setDoc(doc(db, 'users', user.uid), {
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        email: user.email,
        photoURL: user.photoURL || '',
        authProvider: 'google',
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
      const firstName = userData.firstName || '';
      const lastName = userData.lastName || userData.secondName || '';
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    }
    if (user?.displayName) {
      const names = user.displayName.split(' ');
      return names.map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
    }
    return '';
  };

  const getFullName = () => {
    if (userData) {
      return `${userData.firstName || ''} ${userData.lastName || userData.secondName || ''}`.trim();
    }
    return user?.displayName || '';
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