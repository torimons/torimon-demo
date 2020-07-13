import axios from 'axios';
import Map from '@/Map/Map.ts';
import MapDataConverter from './MapDataConverter';
import { mapViewGetters } from '@/store';

export default class API {
    private apiUrl: string = 'https://torimon-api.herokuapp.com/api/v1/maps';

    /**
     * apiから全マップを取得する
     */
    public async getAllMaps() {
        const result: Map[] = [];
        try {
            const res = await axios.get(this.apiUrl);
            res.data.map((jsonMap: any) => {
                result.push(MapDataConverter.json2tree(jsonMap));
            });
            return result;
        } catch (err) {
            return [];
        }
    }

    /**
     * 引数に与えたマップをjsonに変換してアップロードする
     */
    public async postMap(mapToUpload: Map) {
        const json = MapDataConverter.tree2json(mapToUpload);
        const res = await axios.post(
            this.apiUrl,
            json,
        );
    }
}
