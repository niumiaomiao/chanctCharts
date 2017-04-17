/**
 * Created by yelingfeng on 2016/8/16.
 */
/**
 * grid 配置
 */

export function getGirdOption(props) {
    let axisProps = props.axisProps
    let grid = {
        left: axisProps.gridleft,
        right: axisProps.gridRight,
        bottom: axisProps.gridBottom,
        top: axisProps.gridTop,
        containLabel: true
    }
    if (axisProps) {
        grid = {
            left: axisProps.gridleft,
            right: axisProps.gridRight,
            bottom: axisProps.gridBottom,
            top: axisProps.gridTop,
            containLabel: true
        }
    }

    return grid;
}
