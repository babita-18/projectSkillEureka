import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreatorProfile from '../components/CreatorProfile';

const CreatorProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { getCreator, currentUser } = useAuth();
  const [creator, setCreator] = useState(id ? getCreator(id) : undefined);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (id) {
      const creatorData = getCreator(id);
      setCreator(creatorData);
      
      if (currentUser && currentUser.isCreator && currentUser.id === id) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    }
  }, [id, getCreator, currentUser]);
  
  if (!creator) {
    return <Navigate to="/creators" />;
  }

  return (
    <div className="bg-secondary-light min-h-screen">
      <CreatorProfile creatorId={id || ''} isOwner={isOwner} />
    </div>
  );
};

export default CreatorProfilePage;