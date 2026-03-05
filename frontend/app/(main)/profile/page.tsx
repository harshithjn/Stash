"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/supabaseClient";
import { User, Mail, Lock, LogOut, Camera, Save } from "lucide-react";

export default function ProfilePage() {
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    full_name: "",
    bio: "",
    avatar_url: null as string | null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUser(user);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code === "PGRST116") {
        await supabase.from("profiles").insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || "",
          bio: "",
          avatar_url: null,
        });
        setProfile({ full_name: "", bio: "", avatar_url: null });
      } else if (data) {
        setProfile({
          full_name: data.full_name || "",
          bio: data.bio || "",
          avatar_url: data.avatar_url || null,
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage("");

    const updates = {
      id: user.id,
      full_name: profile.full_name,
      bio: profile.bio,
      avatar_url: profile.avatar_url,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("profiles").upsert(updates);

    if (error) setMessage(`Error: ${error.message}`);
    else setMessage("Profile updated successfully");

    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.length) return;

    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setMessage(`Error: ${uploadError.message}`);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: urlData.publicUrl })
      .eq("id", user.id);

    if (updateError) {
      setMessage(`Error: ${updateError.message}`);
    } else {
      setProfile((prev) => ({ ...prev, avatar_url: urlData.publicUrl }));
      setMessage("Avatar updated successfully");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handlePasswordReset = async () => {
    if (!user) return;

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    setMessage(error ? error.message : "Password reset link sent to your email!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading profile...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Avatar & Quick Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-[#111] border border-gray-800 rounded-xl p-6">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-800 bg-gradient-to-br from-purple-600 to-purple-800">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold">
                          {profile.full_name ? profile.full_name[0].toUpperCase() : "U"}
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors">
                      <Camera size={18} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <h2 className="text-xl font-semibold mt-4">{profile.full_name || "User"}</h2>
                  <p className="text-sm text-gray-400">{user?.email}</p>
                </div>
              </div>

              <div className="bg-[#111] border border-gray-800 rounded-xl p-6">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Account Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handlePasswordReset}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-left"
                  >
                    <Lock size={18} className="text-gray-400" />
                    <span className="text-sm">Change Password</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg transition-colors text-left"
                  >
                    <LogOut size={18} />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Profile Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="bg-[#111] border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-6">Personal Information</h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                        <Mail size={16} />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                        <User size={16} />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                        <User size={16} />
                        Bio
                      </label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">Brief description for your profile</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {message && (
                    <div className={`text-sm px-4 py-2 rounded-lg ${
                      message.includes("Error") 
                        ? "bg-red-500/10 text-red-500" 
                        : "bg-green-500/10 text-green-500"
                    }`}>
                      {message}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={saving}
                    className="ml-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    <Save size={18} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
