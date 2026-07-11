import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  query,
  orderBy
} from 'firebase/firestore';

const TRAILS_COLLECTION = 'trails';

// CREATE - Trail add
export const addTrail = async (trailData) => {
  try {
    const docRef = await addDoc(collection(db, TRAILS_COLLECTION), {
      ...trailData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// READ - all Trails
export const getTrails = async () => {
  try {
    const q = query(collection(db, TRAILS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const trails = [];
    querySnapshot.forEach((doc) => {
      trails.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: trails };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// READ - one Trail 
export const getTrailById = async (id) => {
  try {
    const docRef = doc(db, TRAILS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    }
    return { success: false, error: 'Trail not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// UPDATE - Trail update 
export const updateTrail = async (id, trailData) => {
  try {
    const docRef = doc(db, TRAILS_COLLECTION, id);
    await updateDoc(docRef, {
      ...trailData,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// DELETE - Trail delete 
export const deleteTrail = async (id) => {
  try {
    const docRef = doc(db, TRAILS_COLLECTION, id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};