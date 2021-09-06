import React, {useEffect, useState} from 'react'
import Button from '@material-ui/core/Button';
import { 
    selectRestaurant,
    fetchRetauarntsJSON,
    selectIsAPIFinished,
    resetIsAPIFinished,
    selectIsAPIRegected,
} 
from "../features/restaurantsSlice"
import { useSelector, useDispatch } from "react-redux";
import no_image from '../no_image.png'
import { useHistory } from "react-router-dom";


const Result:React.FC= (  ) => {
    const history = useHistory()
    const restaurants = useSelector(selectRestaurant)
    const isAPIFinished = useSelector(selectIsAPIFinished)
    const isAPIRegected = useSelector(selectIsAPIRegected)
    const [restaurant, setRestaurant] = useState<{id: string, name:string, address:string, image1: string, tel:string, url: string}>()
    const [storeImage, setImage] = useState(no_image)
    const [choice, setChoice] = useState<boolean>(false)
    const dispatch = useDispatch()

    useEffect(() => {
        async function get_restaurants(){
            dispatch(fetchRetauarntsJSON())
        }
        get_restaurants()
        // return () => dispatch(resetIsAPIFinished())
    }, [])
    

    useEffect(() => {
        if ( isAPIFinished ) {
            if (restaurants.length !== 0) {
                const min = 0;
                const max = restaurants.length;
                let choiced = Math.floor(Math.random() * (max - min) + min)
                let rest = restaurants[choiced]
                if (rest["image1"]) {
                    setImage(rest["image1"])
                } else {
                    setImage(no_image)
                }
                setRestaurant(rest)
            } else {
                history.push({
                    pathname: '/',
                    state: { error : true }
                })
            }
        }
    }, [isAPIFinished, choice])

    if ( isAPIRegected ) {
        return (
            <div>
                <h1>検索エラーがおきました。</h1>
                <h2>もう一度実行してください</h2>
                <Button onClick={() => history.push({pathname: '/'})}><p className="text-indigo-500 underline">HOME へ</p></Button>
            </div>
        )
    }

    return (
        <div>
            { restaurant ?
                <div className="w-screen">
                    <table className="w-3/5 m-auto">
                        <tbody>
                            <tr><td className="border-2" colSpan={2}><img alt="result" src={storeImage} className="m-auto w-96"/></td></tr>
                            <tr><td className="max-w-40 border-2">店名</td><td className="border-2"><a href={restaurant.url} className="text-indigo-500 underline">{restaurant.name}</a></td></tr>
                            <tr><td className="border-2">住所</td><td className="border-2">{restaurant.address}</td></tr>
                            <tr><td className="border-2">TEL</td><td className="border-2">{restaurant.tel}</td></tr>
                        </tbody>
                    </table>
                    <div className="w-3/5 text-right m-auto">
                        <div>
                            <Button onClick={()=>setChoice(!choice)}><p className="text-indigo-500 underline">同じ条件でもう一度選択する</p></Button>
                        </div>
                        <div>
                            <Button 
                                onClick={() => {history.push({
                                    pathname: '/result/all',
                                    });}}
                            >
                                <p className="text-indigo-500 underline">
                                    {restaurants.length}件の検索結果全てを表示する
                                </p>
                            </Button>
                        </div>
                        <div>
                            <Button onClick={() => history.push({pathname: '/'})}><p className="text-indigo-500 underline">HOME へ</p></Button>
                        </div>
                    </div>
                </div>
                : "loading(初回は時間がかかる場合があります)"
            }
        </div>

    )
}

export default Result
