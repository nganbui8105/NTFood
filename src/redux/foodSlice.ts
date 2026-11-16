import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FALLBACK_FOODS, FALLBACK_RESTAURANTS, fetchFoodsFromApi } from '../api/axiosClient';
import { Food, Restaurant } from '../types';

interface FoodState {
  restaurants: Restaurant[];
  foods: Food[];
  favoriteFoodIds: string[];
  loading: boolean;
  selectedCategory: string;
  searchQuery: string;
}

const initialState: FoodState = {
  restaurants: FALLBACK_RESTAURANTS,
  foods: FALLBACK_FOODS,
  favoriteFoodIds: ['f1', 'f3'],
  loading: false,
  selectedCategory: 'Tất cả',
  searchQuery: '',
};

// AsyncThunk gọi Axios GET /foods từ MockAPI
export const loadFoodsAsync = createAsyncThunk('food/loadFoods', async () => {
  const data = await fetchFoodsFromApi();
  return data;
});

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleFavoriteFood: (state, action: PayloadAction<string>) => {
      const foodId = action.payload;
      if (state.favoriteFoodIds.includes(foodId)) {
        state.favoriteFoodIds = state.favoriteFoodIds.filter((id) => id !== foodId);
      } else {
        state.favoriteFoodIds.push(foodId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFoodsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadFoodsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.foods = action.payload;
      })
      .addCase(loadFoodsAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setSelectedCategory, setSearchQuery, toggleFavoriteFood } = foodSlice.actions;
export default foodSlice.reducer;