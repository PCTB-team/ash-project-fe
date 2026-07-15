import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { profileApi } from '../../features/profile/api/profile.api';

// Async Thunk để gọi API lấy thông tin user
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const data = await profileApi.getProfile();
      const resultData = data.result || (data.email ? data : null);
      if ((data.code === 0 || data.code === 1000 || !data.code) && resultData) {
        return {
          ...resultData,
          avatarUrl: resultData.avatarUrl || resultData.avatar || ''
        };
      }
      return rejectWithValue('Không thể lấy thông tin user');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk để gọi API lấy thông tin dung lượng
export const fetchStorageUsage = createAsyncThunk(
  'user/fetchStorageUsage',
  async (_, { rejectWithValue }) => {
    try {
      const data = await profileApi.getStorageUsage();
      if (data && data.result) {
        return {
          usedStorage: data.result.usedStorage || 0,
          maxStorage: data.result.maxStorage || data.result.quotaSize || data.result.maxStorageSize || data.result.totalCapacity || 500 * 1024 * 1024
        };
      }
      return rejectWithValue('Không thể lấy thông tin dung lượng');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  profileData: null,
  fullName: 'User',
  avatarUrl: '',
  usedStorageBytes: 0,
  maxStorageBytes: 500 * 1024 * 1024,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Reducer đồng bộ cho trường hợp update profile
    updateUserProfileSuccess: (state, action) => {
      state.profileData = action.payload;
      if (action.payload.fullname) state.fullName = action.payload.fullname;
      if (action.payload.avatarUrl) state.avatarUrl = action.payload.avatarUrl;
    },
    clearUserProfile: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileData = action.payload;
        if (action.payload.fullname) state.fullName = action.payload.fullname;
        if (action.payload.avatarUrl) state.avatarUrl = action.payload.avatarUrl;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Storage
      .addCase(fetchStorageUsage.fulfilled, (state, action) => {
        state.usedStorageBytes = action.payload.usedStorage;
        state.maxStorageBytes = action.payload.maxStorage;
      });
  }
});

export const { updateUserProfileSuccess, clearUserProfile } = userSlice.actions;
export default userSlice.reducer;
