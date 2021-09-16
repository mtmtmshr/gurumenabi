import React, {useState, useEffect} from 'react'
import TabPanel from '@material-ui/lab/TabPanel';
import {SimpleSelect, CheckboxLabels} from "./Utils"
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { 
    selectBudget, 
    selectIsPrivateRoom,
    selectIsBottomlessCup,
    setIsBottomlessCup,
    setIsPrivaetRoom,
    setLowerBudget,
    setDist,
    selectDist,
    setStoreLng,
    setStoreLat,
    selectLocation,
    setStoreLocation,
    resetIsAPIFinished
} 
from "../features/restaurantsSlice"
const URL = process.env.REACT_APP_API_URL


const CurrentSearch:React.FC = () => {
    const history = useHistory();
    const dist_list = [500, 1000, 2000, 3000, 4000, 5000]

    const dispatch = useDispatch();
    const [isGeoLoding , setIsGeoLoding ] = useState<boolean>(false)
    const [error, setIsError] = useState<boolean>(false)
    const budget_list = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000]

    const handleSubmit = async () => {
        dispatch(resetIsAPIFinished())
        history.push({
            pathname: '/result',
        })

    }
    const setLng = (lng: number) => dispatch(setStoreLng(lng))
    const setLat = (lat: number) => dispatch(setStoreLat(lat))
    const setLocation = (location: string) => dispatch(setStoreLocation(location))

    const budget = useSelector(selectBudget);
    const dist = useSelector(selectDist);
    const location = useSelector(selectLocation)
    const is_private_room = useSelector(selectIsPrivateRoom);
    const is_bottomless_cup = useSelector(selectIsBottomlessCup);
    
    const handleChangeBudget = (value: number):void => {
        dispatch(setLowerBudget(value))
    }

    const handleChangeDist = (value: number):void => {
        dispatch(setDist(value))
    }


    const handleChangeIsPrivateRoom = (value: boolean):void => {
        dispatch(setIsPrivaetRoom(value))
    }

    const handleChangeIsBottomlessCup = (value: boolean):void => {
        dispatch(setIsBottomlessCup(value))
    }

    const SearchFromCurrentLocation = () => {
        // 位置情報loading開始
        setIsGeoLoding(true)

        getUserGeo().then((result:any) => {
            const params = { lat: result.lat, lng: result.lng }
            const qs = new URLSearchParams(params)
            const fetchAddresFromAPI = () => {
                fetch(`${URL}location?${qs}`, {
                    method: 'GET',
                }).then((res)=>{
                    if (!res.ok) {
                        // fetchエラー
                        setIsError(true)
                    }
                    res.json().then((r) => {
                        setLocation(r.location)
                        setIsGeoLoding(false)
                    }).catch((e) => {
                        setIsError(true)
                    });
                })
                // 経緯度情報をredux storeに保存
                setLng(result.lng)
                setLat(result.lat)
            }
            fetchAddresFromAPI()
        }).catch(error => {
            // 端末が、GeoLacation APIに対応していないときのエラー
            setIsGeoLoding(false)
            setIsError(true)
        });

        
    }

    return (
        <>
            <TabPanel value="2" className="rounded-xl border-2">
                {error && "現在地の取得に失敗しました。"}
                {/*位置情報情報がない かつ 位置情報取得中でない ならば 取得ボタンを表示*/}
                { (!location && !isGeoLoding ) && <Button onClick={()=>SearchFromCurrentLocation()} color="primary" variant="outlined">現在地を取得する</Button> }
                {/* 位置情報取得中 ならば Loadingを表示*/}
                { isGeoLoding && <span className="pl-6">Loading</span>}
                {/* 位置情報がある かつ 位置情報取得中でない ならば 位置情報を表示*/}
                { ( location && !isGeoLoding ) && <span className="pl-6"><span className="pr-6">{location}</span><Button onClick={() => {SearchFromCurrentLocation()}} className="pl-8" color="primary" variant="outlined">地点再登録</Button></span> }

                {(location && !location.includes("香川県") && !isGeoLoding) && <p className="pl-2 text-red-500">この機能は香川県でしか使えません</p>}
                <FormGroup row>
                    <form>
                        <SimpleSelect<number> value={dist} handleChange={handleChangeDist} target_list={dist_list} title="現在地からの距離（m）" disabled={false} />
                        <SimpleSelect<number> value={budget} handleChange={handleChangeBudget} target_list={budget_list} title="BUDGET" disabled={false} />
                        <CheckboxLabels handleChange={handleChangeIsBottomlessCup} label='飲み放題有' checked={is_bottomless_cup} />
                        <CheckboxLabels handleChange={handleChangeIsPrivateRoom} label="個室有" checked={is_private_room} />
                        <Button variant="outlined" onClick={handleSubmit} disabled={!location || !location.includes("香川県")}>検索</Button>
                    </form>
                </FormGroup>
            </TabPanel>
        </>
    )
}


function getUserGeo() {
    //ユーザーのブラウザがGeolocation APIに対応していた場合
    const getLocationFunc = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                //getCurrentPositionメソッドで現在地を取得
                navigator.geolocation.getCurrentPosition(
                    //現在地の取得に成功した場合の処理
                    function(position) {
                        let lat = position.coords.latitude;
                        let lng = position.coords.longitude;
                        let loc = {lat: lat, lng: lng}
                        return resolve(loc)
                    }
                );
            }
            //ユーザーのブラウザがGeolocation APIに対応していなかった場合の処理
            else {
                var errorMessage = "お使いの端末は、GeoLacation APIに対応していません。" ;
                alert( errorMessage ) ;
                return reject(null)
            }
        })
    }

    return getLocationFunc()
}

export default CurrentSearch
