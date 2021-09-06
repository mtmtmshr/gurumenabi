import React, {useState, useEffect} from 'react'
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import Tab from '@material-ui/core/Tab';
import AreaSearch from './AreaSearch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox'
import CurrentSearch from './CurrentSearch';
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { 
    setUseArea,
    setCheckedCategory,
    selectCheckedCategory, 
    selectIsAPIRegected,
    setIsAPIRegected
} 
from "../features/restaurantsSlice"


interface CategoryFormProps {
    category_labels: Array<string>,
    checked_category:{ [category: string]: boolean }
    handleChange:(e: React.ChangeEvent<HTMLInputElement>) => void,
}

function CategoryForm(props:CategoryFormProps) {
    const {category_labels, checked_category, handleChange} = props;
    const categories:Array<JSX.Element> = []
    category_labels.map((category) => {
        return (
            categories.push(
                <FormControlLabel 
                    key={category} 
                    control={<Checkbox checked={checked_category[category]} name={category} onChange={handleChange}/>}
                    label={category}
                />
            )
        )
    })
    return(
        <>
            {categories}
        </>
    );
}


const Home: React.FC = (props) => {
    const [tabValue, setTabValue] = useState("1")
    const location:any = useLocation()
    const dispatch = useDispatch();
    const category_labels = ['ALL', 'ファミレス・ファーストフード', '日本料理・郷土料理', 'イタリアン・フレンチ', 'すし・魚料理・シーフード', '中華', '焼き鳥・肉料理・串料理', '洋食', '鍋', 'ラーメン・麺料理', '欧米・各国料理', 'カフェ・スイーツ', 'お酒', 'アジア・エスニック料理', 'お好み焼き・粉物', '宴会・カラオケ・エンターテイメント', 'カレー', 'ダイニングバー・バー・ビアホール', '和食', '焼肉・ホルモン', 'オーガニック・創作料理', '居酒屋'] 
    const checked_category = useSelector(selectCheckedCategory);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>):void => {
        dispatch(setCheckedCategory(e.target.name))
    }

    useEffect(() => {
        dispatch(setUseArea(true))
        dispatch(setIsAPIRegected(false))
    }, [])

    return (
        <div>
            <h2 className="py-2 text-2xl">飲食店を自動で選択します</h2>
            <h3 className="py-3">条件を選択してください <span className="text-red-500 text-2xl">{location?.state?.error && "検索結果が見つかりませんでした。条件を変更してください"}</span></h3>
            <TabContext value={tabValue}>
                <TabList 
                    onChange={(event:React.ChangeEvent<{}>, newValue:string) => {
                                    setTabValue(newValue);
                                    if ( newValue === "1" ) {
                                        dispatch(setUseArea(true))
                                    } else {
                                        dispatch(setUseArea(false))
                                    } 
                                }
                            }
                    className="border-2" 
                >
                    <Tab label="地域から選択" value="1" />
                    <Tab label="現在地から選択" value="2" />
                </TabList>
                <AreaSearch />
                <CurrentSearch />
                <div className="border-2 mt-14 p-6" >
                    <p className="pb-4 border-b-2 mb-2">カテゴリを選択する</p>
                    <CategoryForm category_labels={category_labels} checked_category={checked_category} handleChange={handleCategoryChange}/>
                </div>
            </TabContext>
        </div>
    )
}

export default Home
