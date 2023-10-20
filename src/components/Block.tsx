import { Sprite } from "@pixi/react";
import { TILE_SIZE } from "../constants";

export default function Block({x, y}: { x: number, y: number }) {
    return (
        <Sprite
            image={"/src/assets/block.png"}
            x={x}
            y={y}
            width={TILE_SIZE}
            height={TILE_SIZE}
            anchor={{ x: 0, y: 0 }}
        />
    );
}
