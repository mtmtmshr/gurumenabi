import React, {useState, useEffect} from 'react'
import Button from '@material-ui/core/Button';
import { 
    selectRestaurant,
} 
from "../features/restaurantsSlice"
import { useSelector } from "react-redux";
import no_image from '../no_image.png'
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';
import { useHistory } from "react-router-dom";

const AllResults:React.FC = () => {
    const [page, setPage] = useState(1)
    const history = useHistory();
    const restaurants = useSelector(selectRestaurant)
    const [restaurants_by_page, setRestaurant] = useState<JSX.Element[]>([])
    const s_idx = 10*(page-1)
    const e_idx = (page === Math.ceil(restaurants.length/10)) ? (restaurants.length % 10) + 10 * (page-1) : 10 * page
    useEffect(() => {
        let rests:JSX.Element[] = []
        for (let i=s_idx; i<e_idx; i++ ) {
            const restaurant = restaurants[i]
            if ( ! restaurant ) {
                continue
            }
            let image = no_image
            if (restaurant["image1"]){
                image = restaurant["image1"]
            }
            rests.push(
                <li key={restaurant["id"]}>
                    <div className="flex w-screen">
                        <div className="flex m-auto w-7/12 box-border-2 border-2 my-4 :bg-green-500">
                            <div className="w-5/12 relative border-r-2">
                                <img src={image} alt="result" className="max-h-full, xl, lg, md: max-h-52 xl, lg, md:max-w-80 m-auto absolute inset-0"/>
                            </div>
                            
                            <div className="w-full text-xs xl, lg, md:pt-12 xl, lg, md:pl-12 xl, lg, md:h-52">
                                <p><a href={restaurant["url"]} className="text-indigo-500 underline xl, lg, md:text-lg">{restaurant["name"]}</a></p>
                                <p className="pt-2">{restaurant["address"]}</p>
                                <p className="pt-2">{restaurant["tel"]}</p>
                            </div>
                        </div>
                    </div>
                </li>
            )
        }
        setRestaurant(rests)
    }
    ,[page, e_idx, restaurants, s_idx] )

    return(
        <>
            <h3 className="text-2xl  md, lg, xl:text-3xl pb-4">検索結果（全{restaurants.length}件）</h3>
            <span className="text-xl md, lg, xl:text-2xl">{s_idx+1}〜{e_idx}件</span>
            <div>
                <ul>
                    {restaurants_by_page}
                </ul>
            </div>
            <div className="mt-4">
                <Grid container alignItems="center">
                    <Pagination count={Math.ceil(restaurants.length/10)} page={page} onChange={(e, v) => setPage(v)} size="small" className="pagenation"/>
                </Grid>
            </div>
            <div className="mb-14 mt-6">
                <Button onClick={() => history.push({pathname: '/'})}><p className="text-indigo-500 underline">HOME へ</p></Button>
            </div>
        </>
    )
}

export default AllResults
