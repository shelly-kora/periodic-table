// 为元素添加拼音补充
document.addEventListener('DOMContentLoaded', function() {
    // 定义一个函数，为缺少拼音的元素添加拼音
    window.addPinyinToElements = function() {
        // 拼音映射表 - 覆盖1-86号元素
        const pinyinMap = {
            // 1-20号元素
            '氢': 'qīng',
            '氦': 'hài',
            '锂': 'lǐ',
            '铍': 'pí',
            '硼': 'péng',
            '碳': 'tàn',
            '氮': 'dàn',
            '氧': 'yǎng',
            '氟': 'fú',
            '氖': 'nài',
            '钠': 'nà',
            '镁': 'měi',
            '铝': 'lǚ',
            '硅': 'guī',
            '磷': 'lín',
            '硫': 'liú',
            '氯': 'lǜ',
            '氩': 'yà',
            '钾': 'jiǎ',
            '钙': 'gài',
            
            // 21-40号元素
            '钪': 'kàng',
            '钛': 'tài',
            '钒': 'fán',
            '铬': 'gè',
            '锰': 'měng',
            '铁': 'tiě',
            '钴': 'gǔ',
            '镍': 'niè',
            '铜': 'tóng',
            '锌': 'xīn',
            '镓': 'jiā',
            '锗': 'zhě',
            '砷': 'shēn',
            '硒': 'xī',
            '溴': 'xiù',
            '氪': 'kè',
            '铷': 'rú',
            '锶': 'sī',
            '钇': 'yǐ',
            '锆': 'gào',
            
            // 41-60号元素
            '铌': 'ní',
            '钼': 'mù',
            '锝': 'dé',
            '钌': 'liào',
            '铑': 'lǎo',
            '钯': 'bǎ',
            '银': 'yín',
            '镉': 'gé',
            '铟': 'yīn',
            '锡': 'xī',
            '锑': 'tī',
            '碲': 'dì',
            '碘': 'diǎn',
            '氙': 'xiān',
            '铯': 'sè',
            '钡': 'bèi',
            '镧': 'lán',
            '铈': 'shì',
            '镨': 'pǔ',
            '钕': 'nǚ',
            
            // 61-80号元素
            '钷': 'pó',
            '钐': 'shān',
            '铕': 'yòu',
            '钆': 'gá',
            '铽': 'tè',
            '镝': 'dī',
            '钬': 'huǒ',
            '铒': 'ěr',
            '铥': 'diū',
            '镱': 'yì',
            '镥': 'lǔ',
            '铪': 'hā',
            '钽': 'tǎn',
            '钨': 'wū',
            '铼': 'lái',
            '锇': 'é',
            '铱': 'yī',
            '铂': 'bó',
            '金': 'jīn',
            '汞': 'gǒng',
            
            // 81-86号元素
            '铊': 'tā',
            '铅': 'qiān',
            '铋': 'bì',
            '钋': 'pō',
            '砹': 'ài',
            '氡': 'dōng'
        };
        
        // 计数器
        let updatedCount = 0;
        
        // 遍历所有元素
        if (window.elements && window.elements.length > 0) {
            window.elements.forEach(element => {
                // 如果元素没有拼音名称但在映射表中存在对应的中文名称
                if (element.number <= 86 && (!element.pinyinName || element.pinyinName === '') && element.chineseName && pinyinMap[element.chineseName]) {
                    element.pinyinName = pinyinMap[element.chineseName];
                    updatedCount++;
                    console.log('为元素 ' + element.chineseName + '(' + element.symbol + ') 添加拼音: ' + element.pinyinName);
                }
            });
            
            console.log('共更新了 ' + updatedCount + ' 个元素的拼音发音');
            
            // 更新周期表显示
            if (typeof generatePeriodicTable === 'function') {
                generatePeriodicTable();
            }
        } else {
            console.error('元素数据未加载，无法添加拼音');
        }
    };
    
    // 确保在元素数据加载后才执行拼音添加
    setTimeout(addPinyinToElements, 500);
});
