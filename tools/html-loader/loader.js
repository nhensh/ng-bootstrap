/**
 * Created by huangjin on 16/5/12.
 */
module.exports = loader
function loader() {
    return [
        require.resolve('./index.js')
    ].join('!')
}
