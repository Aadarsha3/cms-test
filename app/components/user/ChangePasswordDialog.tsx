import { useState } from "react";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ChangePasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface PasswordStrength {
    score: number;
    label: string;
    color: string;
}

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
    const { toast } = useToast();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const calculatePasswordStrength = (password: string): PasswordStrength => {
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 1) return { score, label: "Weak", color: "bg-destructive" };
        if (score <= 3) return { score, label: "Medium", color: "bg-yellow-500" };
        return { score, label: "Strong", color: "bg-green-500" };
    };

    const passwordStrength = calculatePasswordStrength(newPassword);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validate current password
        if (!currentPassword) {
            newErrors.currentPassword = "Current password is required";
        }

        // Validate new password
        if (!newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters";
        } else if (!/[a-z]/.test(newPassword)) {
            newErrors.newPassword = "Password must contain lowercase letters";
        } else if (!/[A-Z]/.test(newPassword)) {
            newErrors.newPassword = "Password must contain uppercase letters";
        } else if (!/\d/.test(newPassword)) {
            newErrors.newPassword = "Password must contain numbers";
        } else if (!/[^A-Za-z0-9]/.test(newPassword)) {
            newErrors.newPassword = "Password must contain special characters";
        } else if (newPassword === currentPassword) {
            newErrors.newPassword = "New password must be different from current password";
        }

        // Validate confirm password
        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your new password";
        } else if (confirmPassword !== newPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        // todo: Replace with real API call
        // For now, just simulate success
        toast({
            title: "Password changed successfully",
            description: "Your password has been updated.",
        });

        // Reset form and close dialog
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({});
        onOpenChange(false);
    };

    const handleCancel = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({});
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Change Password
                    </DialogTitle>
                    <DialogDescription>
                        Enter your current password and choose a new secure password.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Current Password */}
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <div className="relative">
                            <Input
                                id="current-password"
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => {
                                    setCurrentPassword(e.target.value);
                                    setErrors({ ...errors, currentPassword: "" });
                                }}
                                placeholder="Enter current password"
                                data-testid="input-current-password"
                                className={errors.currentPassword ? "border-destructive" : ""}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                tabIndex={-1}
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.currentPassword && (
                            <p className="text-sm text-destructive">{errors.currentPassword}</p>
                        )}
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                            <Input
                                id="new-password"
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    setErrors({ ...errors, newPassword: "" });
                                }}
                                placeholder="Enter new password"
                                data-testid="input-new-password"
                                className={errors.newPassword ? "border-destructive" : ""}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                tabIndex={-1}
                            >
                                {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-sm text-destructive">{errors.newPassword}</p>
                        )}

                        {/* Password Strength Indicator */}
                        {newPassword && !errors.newPassword && (
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-medium">{passwordStrength.label}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <div className="relative">
                            <Input
                                id="confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setErrors({ ...errors, confirmPassword: "" });
                                }}
                                placeholder="Confirm new password"
                                data-testid="input-confirm-password"
                                className={errors.confirmPassword ? "border-destructive" : ""}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Password Requirements */}
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                            <strong>Password requirements:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-0.5">
                                <li>At least 8 characters</li>
                                <li>Contains uppercase and lowercase letters</li>
                                <li>Contains numbers</li>
                                <li>Contains special characters (!@#$%^&*)</li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} data-testid="button-submit-password-change">
                        Change Password
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
