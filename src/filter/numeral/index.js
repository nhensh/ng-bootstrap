import numeral from 'numeral'
import app from '../../module'
app.filter('numeral', /*@ngInject*/() => {
    return (raw, format = '0.0a') => {
        raw = raw || 0
        return numeral(raw).format(format);
    }
})