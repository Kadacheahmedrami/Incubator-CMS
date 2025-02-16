// components/SignoutButton.js
"use client"
export default function SignoutButton() {
  const handleSignout = async () => {
    const res = await fetch('/api/auth/signout', {
      method: 'POST',
    });

    if (res.ok) {   
      window.location.href = '/signout'; // Redirect to login page
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={handleSignout}
        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
      >
        Sign Out
      </button>
    </div>
  );
}
