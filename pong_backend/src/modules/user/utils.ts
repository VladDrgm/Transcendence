export function trimAvatarPath(avatarPath: string): string {
  const parts = avatarPath.split('/avatars/');
  if (parts.length > 1) {
    return '/avatars/' + parts[1];
  } else {
    return avatarPath;
  }
}
