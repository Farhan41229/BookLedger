import { useState, useRef } from 'react';
import { Camera, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useAuthStore from '@/store/authStore';
import toast from 'react-hot-toast';

export default function ProfileForm() {
  const { user, updateProfile, isLoading } = useAuthStore();
  
  const [name, setName] = useState(user?.name || '');
  const [imagePreview, setImagePreview] = useState(user?.profileImage || null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    if (imageFile) {
      formData.append('profileImage', imageFile);
    }

    const res = await updateProfile(formData);
    if (res.success) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error(res.error || "Failed to update profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center sm:items-start gap-4">
        <label className="text-sm font-semibold text-muted-foreground">Profile Image</label>
        <div className="relative group">
          <Avatar className="h-24 w-24 border-2 border-primary/20">
            <AvatarImage src={imagePreview} alt={name} className="object-cover" />
            <AvatarFallback className="text-xl bg-muted">
              {name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div 
            className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-6 w-6 text-white" />
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        {imageFile && (
           <p className="text-xs text-muted-foreground">New image selected</p>
        )}
      </div>

      <div className="space-y-4 max-w-md">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-semibold text-muted-foreground">Full Name</label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Your full name"
            className="bg-muted/50"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-muted-foreground">Email Address</label>
          <div className="px-3 py-2 border rounded-md bg-muted/50 text-muted-foreground cursor-not-allowed">
            {user?.email}
          </div>
          <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-muted-foreground">Role</label>
          <div className="px-3 py-2 border rounded-md bg-muted/50 text-muted-foreground cursor-not-allowed">
            {user?.role}
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
