export function trimAvatarPath(avatarPath: string): string {
  const indexOfNet = avatarPath.indexOf('/net');
  const indexOfAvatars = avatarPath.indexOf('/avatars/');

  if (indexOfNet !== -1 && indexOfAvatars !== -1) {
    return avatarPath.substring(indexOfAvatars + 1);
  } else {
    return avatarPath;
  }
}
