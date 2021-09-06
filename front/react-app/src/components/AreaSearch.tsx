import React from 'react'
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
    setArea,
    selectArea,
    resetIsAPIFinished,
    fetchRetauarntsJSON,
} 
from "../features/restaurantsSlice"


const AreaSerch:React.FC = () => {
    const history = useHistory();
    const area_list:string[] = ["高松市全域", "瓦町駅周辺", "丸亀町商店街・高松ライオン通り", "高松駅周辺", "その他高松"]
    const budget_list = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000]
    const budget = useSelector(selectBudget);
    const area = useSelector(selectArea);
    const is_private_room = useSelector(selectIsPrivateRoom);
    const is_bottomless_cup = useSelector(selectIsBottomlessCup);
    const dispatch = useDispatch()
    const handleChangeBudget = (value: number):void => {
        dispatch(setLowerBudget(value))
    }

    const handleChangeIsPrivateRoom = (value: boolean):void => {
        dispatch(setIsPrivaetRoom(value))
    }

    const handleChangeIsBottomlessCup = (value: boolean):void => {
        dispatch(setIsBottomlessCup(value))
    }

    const handleChangeArea = (value: string):void => {
        dispatch(setArea(value))
    }

    const handleSubmit = async () => {
        dispatch(resetIsAPIFinished())
        history.push({
            pathname: '/result',
        })

    }

    return (
        <>
            <TabPanel value="1" className="rounded-xl border-2">
                <FormGroup row>
                    <form>
                        <SimpleSelect<string> value={area} handleChange={handleChangeArea} target_list={area_list} title="AREA" disabled={false} />
                        <SimpleSelect<number> value={budget} handleChange={handleChangeBudget} target_list={budget_list} title="BUDGET" disabled={false} />
                        <CheckboxLabels handleChange={handleChangeIsBottomlessCup} label='飲み放題有' checked={is_bottomless_cup} />
                        <CheckboxLabels handleChange={handleChangeIsPrivateRoom} label="個室有" checked={is_private_room} />
                        <Button 
                            variant="outlined"
                            onClick={handleSubmit}
                        >
                            検索
                        </Button>
                    </form>
                </FormGroup>
            </TabPanel>
        </>
    )
}

export default AreaSerch
