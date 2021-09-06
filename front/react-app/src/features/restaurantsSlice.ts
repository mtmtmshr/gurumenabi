import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../app/store'
import axios from 'axios'


const category_labels = ['ファミレス・ファーストフード', '日本料理・郷土料理', 'イタリアン・フレンチ', 'すし・魚料理・シーフード', '中華', '焼き鳥・肉料理・串料理', '洋食', '鍋', 'ラーメン・麺料理', '欧米・各国料理', 'カフェ・スイーツ', 'お酒', 'アジア・エスニック料理', 'お好み焼き・粉物', '宴会・カラオケ・エンターテイメント', 'カレー', 'ダイニングバー・バー・ビアホール', '和食', '焼肉・ホルモン', 'オーガニック・創作料理', '居酒屋']

interface restaurantState {
    useArea: boolean,
    area: string,
    is_bottomless_cup: boolean,
    is_private_room: boolean,
    dist: number,
    lowerbudget: number,
    checked_category: { [category: string]: boolean }
    restaurants: {id: string, name:string, url: string
        address:string, image1: string, tel:string}[],
    lat: number,
    lng: number,
    location: string,
    isAPIfinished: boolean,
    isAPIRegected: boolean
}

const initialState:restaurantState = {
    useArea: true,
    area: "高松市全域",
    is_bottomless_cup: false,
    is_private_room: false,
    dist: 1000,
    lowerbudget:4000,
    checked_category : ({
        'ALL': true, 'ファミレス・ファーストフード': true, '日本料理・郷土料理': true, 'イタリアン・フレンチ': true, 'すし・魚料理・シーフード': true, '中華': true, '焼き鳥・肉料理・串料理': true, '洋食': true, '鍋': true, 'ラーメン・麺料理': true, '欧米・各国料理': true, 'カフェ・スイーツ': true, 'お酒': true, 'アジア・エスニック料理': true, 'お好み焼き・粉物': true, '宴会・カラオケ・エンターテイメント': true, 'カレー': true, 'ダイニングバー・バー・ビアホール': true, '和食': true, '焼肉・ホルモン': true, 'オーガニック・創作料理': true, '居酒屋': true
    }),
    restaurants: [],
    lat: -1,
    lng: -1,
    location: "",
    isAPIfinished: false,
    isAPIRegected: false
}

const URL = process.env.REACT_APP_API_URL

export const fetchRetauarntsJSON = createAsyncThunk("fetch/api", async (_, {getState}) => {
    const state = getState() as RootState
    let restaurants = undefined;
    if ( state.restaurant.useArea ) {
        const res = await axios.get(`${URL}gurume`, {
            params: {
                area: state.restaurant.area,
                is_bottomless_cup: state.restaurant.is_bottomless_cup,
                is_private_room: state.restaurant.is_private_room,
                lowerbudget:state.restaurant.lowerbudget,
                checked_category: state.restaurant.checked_category
            }
        });
        restaurants = res.data;
    } else {
        const res = await axios.get(`${URL}locationSearch`, {
            params: {
                distance: state.restaurant.dist,
                lat: state.restaurant.lat,
                lng: state.restaurant.lng,
                is_bottomless_cup: state.restaurant.is_bottomless_cup,
                is_private_room: state.restaurant.is_private_room,
                lowerbudget:state.restaurant.lowerbudget,
                checked_category: state.restaurant.checked_category
            }
        });
        restaurants = res.data;
    }
    return restaurants;
});



export const restaurantSlice = createSlice({
    name: "restaurant",
    initialState,
    reducers: {
        setArea: (state, action: PayloadAction<string>) => {
            state.area = action.payload
        },
        setIsBottomlessCup: (state, action: PayloadAction<boolean>) => {
            state.is_bottomless_cup = action.payload
        },
        setIsPrivaetRoom: (state, action: PayloadAction<boolean>) => {
            state.is_private_room = action.payload
        },
        setDist: (state, action: PayloadAction<number>) => {
            state.dist = action.payload
        },
        setStoreLng: (state, action: PayloadAction<number>) => {
            state.lng = action.payload
        },
        setStoreLat: (state, action: PayloadAction<number>) => {
            state.lat = action.payload
        },
        setLowerBudget: (state, action: PayloadAction<number>) => {
            state.lowerbudget = action.payload
        },
        setCheckedCategory: (state, action: PayloadAction<string>) => {
            if (action.payload !== "ALL") {
                state.checked_category[action.payload] = !state.checked_category[action.payload]
            } else {
                state.checked_category[action.payload] = !state.checked_category[action.payload]
                category_labels.map(category => {
                    return state.checked_category[category] = state.checked_category[action.payload];
                })
            }
        },
        setStoreLocation: (state, action: PayloadAction<string>) => {
            state.location = action.payload
        },
        resetIsAPIFinished: (state, action: PayloadAction<void>) => {
            state.isAPIfinished = false
        },
        setUseArea: (state, action: PayloadAction<boolean>) => {
            state.useArea = action.payload
        },
        setIsAPIRegected: (state, action: PayloadAction<boolean>) => {
            state.isAPIRegected = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRetauarntsJSON.fulfilled, (state, action) => {
            state.restaurants = action.payload;
            state.isAPIfinished = true
        });
        builder.addCase(fetchRetauarntsJSON.rejected, (state, action) => {
            state.isAPIRegected = true
        });
    }
})

export const {
    setUseArea,
    setArea,
    setIsBottomlessCup,
    setIsPrivaetRoom,
    setDist,
    setLowerBudget,
    setCheckedCategory,
    setStoreLat,
    setStoreLng,
    setStoreLocation,
    resetIsAPIFinished,
    setIsAPIRegected
} = restaurantSlice.actions;

export const selectIsAPIRegected = (state: RootState) => state.restaurant.isAPIRegected;
export const selectIsAPIFinished = (state: RootState) => state.restaurant.isAPIfinished;
export const selectCheckedCategory = (state: RootState) => state.restaurant.checked_category;
export const selectDist = (state: RootState) => state.restaurant.dist;
export const selectLocation = (state: RootState) => state.restaurant.location;
export const selectArea = (state: RootState) => state.restaurant.area;
export const selectBudget = (state: RootState) => state.restaurant.lowerbudget;
export const selectIsBottomlessCup = (state: RootState) => state.restaurant.is_bottomless_cup;
export const selectIsPrivateRoom = (state: RootState) => state.restaurant.is_private_room;
export const selectRestaurant = (state: RootState) => state.restaurant.restaurants;
export default restaurantSlice.reducer;