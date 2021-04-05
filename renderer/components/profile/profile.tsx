import { useApiQuery } from '@/libs/api';
import { useLogout } from '@/libs/auth';
import { styled } from '@/styles';
import { Icon, IconButton } from '@/ui';
import * as React from 'react';

interface Props {
  onInit?: () => void;
}

const Profile: React.FC<Props> = ({ onInit }) => {
  const query = useApiQuery();
  const logout = useLogout();
  const [user, setUser] = React.useState<SpotifyApi.UserObjectPrivate | null>(
    null
  );

  async function loadProfile() {
    const userResponse = await query((api) => api.getMe());

    if (userResponse) {
      setUser(userResponse);
    }
    onInit && onInit();
  }

  React.useEffect(() => {
    loadProfile();
  }, []);

  const imageUrl = getUserImageUrl(user);

  if (!user) return null;

  return (
    <div>
      <Box>
        {imageUrl && (
          <Image
            src={imageUrl}
            width="40px"
            height="40px"
            alt="Profile picture"
          />
        )}

        <strong>{user.display_name}</strong>
      </Box>

      <Box>
        <LogoutButton onClick={() => logout()} aria-label="Logout">
          <Icon css={{ mr: '$2' }} size="4">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </Icon>
          Logout
        </LogoutButton>
      </Box>
    </div>
  );
};

export default Profile;

export function getUserImageUrl(user?: SpotifyApi.UserObjectPrivate | null) {
  return user?.images?.[0]?.url || null;
}

const Box = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  '&:not(:last-child)': {
    mb: '$4',
  },
});

const Image = styled('img', {
  borderRadius: '$full',
  mr: '$4',
});

const LogoutButton = styled(IconButton, {
  gridColumn: '1 / span 2',
  size: 'unset',
  px: '$4',
  height: '$8',
  fontSize: '$sm',
  borderWidth: '2px',
  justifySelf: 'center',
});
