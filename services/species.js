import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc,
  query,
  orderBy,
  where
} from 'firebase/firestore';

const SPECIES_COLLECTION = 'species';

// CREATE -claude
export const addSpeciesLog = async (speciesData, photoUri) => {
  try {
    // Save data to Firestore
    const docRef = await addDoc(collection(db, SPECIES_COLLECTION), {
      ...speciesData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Save error:', error);
    return { success: false, error: error.message };
  }
};

// READ - All species logs
export const getSpeciesLogs = async () => {
  try {
    const q = query(collection(db, SPECIES_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const logs = [];
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: logs };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// DELETE - Species log
export const deleteSpeciesLog = async (id, photoUrl) => {
  try {
    const docRef = doc(db, SPECIES_COLLECTION, id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};