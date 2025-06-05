import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth, saveUserProfile, getUserProfile, uploadProfileImage, deleteProfileImage } from "./firebase";

export default function Profile({ darkMode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Fallback functions for localStorage
  const saveToLocalStorage = useCallback((displayName, photoURL) => {
    localStorage.setItem("profileDisplayName", displayName);
    localStorage.setItem("profilePhotoURL", photoURL);
    
    if (user) {
      const updatedUser = { 
        ...user, 
        displayName: displayName, 
        photoURL: photoURL 
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  }, [user]);

  const loadFromLocalStorage = useCallback(() => {
    const savedDisplayName = localStorage.getItem("profileDisplayName");
    const savedPhotoURL = localStorage.getItem("profilePhotoURL");
    return {
      displayName: savedDisplayName || user?.displayName || "",
      photoURL: savedPhotoURL || user?.photoURL || ""
    };
  }, [user]);

  useEffect(() => {
    const unsubscribe = auth?.onAuthStateChanged(async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);

          // Load profile data from Firebase or localStorage
          try {
            const profileData = await getUserProfile(currentUser.uid);
            if (profileData) {
              setDisplayName(profileData.displayName || currentUser.displayName || "");
              setPhotoURL(profileData.photoURL || currentUser.photoURL || "");
            } else {
              // Fallback to localStorage if Firebase data is not available
              const localData = loadFromLocalStorage();
              setDisplayName(localData.displayName);
              setPhotoURL(localData.photoURL);
            }
          } catch (error) {
            console.error("Error loading profile:", error);
            // Fallback to localStorage on error
            const localData = loadFromLocalStorage();
            setDisplayName(localData.displayName);
            setPhotoURL(localData.photoURL);
          }
        } else {
          navigate("/"); // Redirect to home if no user is logged in
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        const localData = loadFromLocalStorage();
        setDisplayName(localData.displayName);
        setPhotoURL(localData.photoURL);
      } finally {
        setLoading(false); // Ensure loading state is updated
      }
    });

    return () => unsubscribe && unsubscribe(); // Cleanup subscription
  }, [navigate, loadFromLocalStorage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage("Please select a valid image file.");
        setTimeout(() => setMessage(""), 3000);
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Image size should be less than 5MB.");
        setTimeout(() => setMessage(""), 3000);
        return;
      }
      
      setImageFile(file);
      
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoURL(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    
    setUploading(true);
    let finalPhotoURL = photoURL;
    let useFirebase = true;
    
    try {
      // Try Firebase first
      if (imageFile) {
        try {
          // Delete old profile image if it exists and is from Firebase Storage
          if (photoURL && photoURL.includes('firebase')) {
            await deleteProfileImage(photoURL);
          }
          
          // Upload new image
          finalPhotoURL = await uploadProfileImage(user.uid, imageFile);
        } catch (uploadError) {
          console.error("Firebase upload failed, using base64:", uploadError);
          useFirebase = false;
          // Convert to base64 for localStorage fallback
          const reader = new FileReader();
          reader.onload = (e) => {
            finalPhotoURL = e.target.result;
          };
          reader.readAsDataURL(imageFile);
          await new Promise(resolve => {
            reader.onloadend = resolve;
          });
        }
      }
      
      // Try to save to Firebase
      if (useFirebase) {
        const profileData = {
          displayName,
          photoURL: finalPhotoURL,
          email: user.email,
          lastUpdated: new Date().toISOString(),
        };
        
        const firebaseSuccess = await saveUserProfile(user.uid, profileData);
        
        if (!firebaseSuccess) {
          useFirebase = false;
        }
      }
      
      // Fallback to localStorage if Firebase fails
      if (!useFirebase) {
        console.log("Using localStorage fallback");
        saveToLocalStorage(displayName, finalPhotoURL);
      }
      
      setPhotoURL(finalPhotoURL);
      setImageFile(null);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('profileUpdated', {
        detail: { displayName, photoURL: finalPhotoURL }
      }));
      
      setIsEditing(false);
      setMessage(useFirebase ? "Profile updated successfully!" : "Profile updated locally (Firebase unavailable)");
      
    } catch (error) {
      console.error("Error saving profile:", error);
      // Last resort - save to localStorage
      saveToLocalStorage(displayName, photoURL);
      window.dispatchEvent(new CustomEvent('profileUpdated', {
        detail: { displayName, photoURL }
      }));
      setMessage("Profile saved locally. Some features may be limited.");
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const cancelEdit = async () => {
    // Reset to original values
    try {
      const profileData = await getUserProfile(user.uid);
      if (profileData) {
        setDisplayName(profileData.displayName || user.displayName || "");
        setPhotoURL(profileData.photoURL || user.photoURL || "");
      } else {
        // Fallback to localStorage
        const localData = loadFromLocalStorage();
        setDisplayName(localData.displayName);
        setPhotoURL(localData.photoURL);
      }
    } catch (error) {
      // Fallback to localStorage
      const localData = loadFromLocalStorage();
      setDisplayName(localData.displayName);
      setPhotoURL(localData.photoURL);
    }
    setImageFile(null);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 sm:p-6 md:p-8 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            My Profile
          </h1>
          <button
            onClick={() => navigate("/")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-white hover:bg-gray-100 text-gray-900'
            } shadow-md`}
          >
            ← Back to Home
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes("successfully") || message.includes("saved")
              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
          }`}>
            {message}
          </div>
        )}

        {/* Profile Card */}
        <div className={`rounded-xl shadow-lg p-6 sm:p-8 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-4 border-indigo-500 shadow-lg">
                  <span className="text-2xl sm:text-3xl text-white font-bold">
                    {displayName ? displayName.charAt(0).toUpperCase() : "👤"}
                  </span>
                </div>
              )}
              
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  📷
                </label>
              )}
            </div>
            
            {imageFile && (
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                New image selected: {imageFile.name}
              </p>
            )}
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Display Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Display Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  placeholder="Enter your display name"
                />
              ) : (
                <p className={`px-4 py-3 rounded-lg ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
                } border`}>
                  {displayName || "Not set"}
                </p>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email
              </label>
              <p className={`px-4 py-3 rounded-lg ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'
              } border`}>
                {user?.email}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={saveProfile}
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                <button
                  onClick={cancelEdit}
                  disabled={uploading}
                  className={`flex-1 ${
                    darkMode 
                      ? 'bg-gray-600 hover:bg-gray-500' 
                      : 'bg-gray-500 hover:bg-gray-600'
                  } disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-2`}
                >
                  <span>❌</span>
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>✏️</span>
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
