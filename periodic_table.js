// 移除默认图片和视频URL常量
// const DEFAULT_ELEMENT_IMAGE = 'https://placehold.co/300x200/E3F2FD/0D47A1?text=';
// const DEFAULT_ELEMENT_VIDEO = 'https://www.youtube.com/embed/BHACKCNDMW8';

document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const periodicTableEl = document.getElementById('periodicTable');
    const elementDetailsEl = document.getElementById('elementDetails');
    const closeBtn = document.getElementById('closeDetails');
    
    // 当前选中的元素
    let currentElement = null;
    
    // 元素表格布局数据：行、列坐标
    const elementPositions = createElementPositionsMap();
    
    // 生成周期表
    generatePeriodicTable();
    
    // 绑定关闭按钮事件
    closeBtn.addEventListener('click', function() {
        elementDetailsEl.classList.remove('active');
        // 移除视频相关代码
        // document.getElementById('elementVideo').src = '';
    });
    
    // 绑定分享按钮事件
    document.getElementById('copyLinkBtn').addEventListener('click', function() {
        copyElementLink();
    });
    
    document.getElementById('shareWechatBtn').addEventListener('click', function() {
        shareToWechat();
    });
    
    document.getElementById('shareWeiboBtn').addEventListener('click', function() {
        shareToWeibo();
    });
    
    // 函数：生成周期表
    function generatePeriodicTable() {
        // 清空当前周期表
        periodicTableEl.innerHTML = '';
        
        // 创建18列的网格
        for (let i = 1; i <= 9; i++) {  // 周期
            for (let j = 1; j <= 18; j++) {  // 族
                // 创建一个网格单元
                const cell = document.createElement('div');
                cell.className = 'element-cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                // 查找该位置是否有元素
                const element = findElementByPosition(i, j);
                
                if (element) {
                    // 如果有元素，填充元素内容
                    cell.className = `element ${element.category}`;
                    cell.innerHTML = `
                        <div class="number">${element.number}</div>
                        <div class="symbol">${element.symbol}</div>
                        <div class="name">${element.chineseName || element.name}</div>
                        <div class="pinyin">${element.pinyinName || ''}</div>
                    `;
                    
                    // 添加点击事件
                    cell.addEventListener('click', function() {
                        showElementDetails(element);
                    });
                } else {
                    // 特殊处理：f区元素的位置显示点点
                    if ((i === 6 && j >= 3 && j <= 16) || (i === 7 && j >= 3 && j <= 16)) {
                        if (j === 3) {
                            // 在第3列显示箭头指示符
                            const arrowDirection = i === 6 ? '↓' : '↓';
                            cell.innerHTML = `<div class="arrow-placeholder">${arrowDirection}</div>`;
                            cell.className = 'element-cell placeholder';
                        } else {
                            cell.className = 'element-cell empty';
                        }
                    }
                    
                    // 在镧系和锕系区域添加标签
                    if (i === 8 && j === 2) {
                        cell.innerHTML = `<div class="series-label">镧系</div>`;
                        cell.className = 'element-cell series-header';
                    } else if (i === 9 && j === 2) {
                        cell.innerHTML = `<div class="series-label">锕系</div>`;
                        cell.className = 'element-cell series-header';
                    }
                }
                
                // 将单元格添加到周期表
                periodicTableEl.appendChild(cell);
            }
        }
        
        // 添加周期表图例说明
        if (!document.querySelector('.periodic-table-legend')) {
            addPeriodicTableLegend();
        }
    }
    
    // 添加周期表图例说明
    function addPeriodicTableLegend() {
        const legendEl = document.createElement('div');
        legendEl.className = 'periodic-table-legend';
        legendEl.innerHTML = `
            <div class="legend-title">元素分类</div>
            <div class="legend-items">
                <div class="legend-item"><span class="color-box alkali-metal"></span> 碱金属</div>
                <div class="legend-item"><span class="color-box alkaline-earth"></span> 碱土金属</div>
                <div class="legend-item"><span class="color-box transition-metal"></span> 过渡金属</div>
                <div class="legend-item"><span class="color-box post-transition-metal"></span> 后过渡金属</div>
                <div class="legend-item"><span class="color-box metalloid"></span> 类金属</div>
                <div class="legend-item"><span class="color-box nonmetal"></span> 非金属</div>
                <div class="legend-item"><span class="color-box noble-gas"></span> 稀有气体</div>
                <div class="legend-item"><span class="color-box lanthanide"></span> 镧系元素</div>
                <div class="legend-item"><span class="color-box actinide"></span> 锕系元素</div>
            </div>
        `;
        document.querySelector('.periodic-table').after(legendEl);
    }
    
    // 函数：通过位置查找元素
    function findElementByPosition(period, group) {
        // 首先检查这个位置是否有元素
        const position = `${period}-${group}`;
        if (!elementPositions[position]) {
            return null;
        }
        
        // 通过原子序数查找元素
        return elements.find(el => el.number === elementPositions[position]);
    }
    
    // 函数：显示元素详情
    function showElementDetails(element) {
        // 保存当前选中的元素
        currentElement = element;
        
        // 更新URL以支持链接分享
        updateUrlWithElement(element);
        
        // 填充详情
        const elementName = document.getElementById('elementName');
        elementName.textContent = element.chineseName || element.name;
        
        // 添加拼音显示
        const elementPinyin = document.getElementById('elementPinyin');
        if (elementPinyin) {
            elementPinyin.textContent = element.pinyinName || '';
        } else {
            // 如果还没有拼音元素，创建一个
            const pinyinEl = document.createElement('div');
            pinyinEl.id = 'elementPinyin';
            pinyinEl.className = 'element-pinyin';
            pinyinEl.textContent = element.pinyinName || '';
            elementName.parentNode.insertBefore(pinyinEl, elementName.nextSibling);
        }
        
        document.getElementById('elementSymbol').textContent = element.symbol;
        document.getElementById('elementSymbol').className = `element-symbol ${element.category}`;
        document.getElementById('elementNumber').textContent = element.number;
        document.getElementById('elementWeight').textContent = element.weight;
        document.getElementById('elementDiscoverer').textContent = element.discoverer || '未知';
        document.getElementById('elementYear').textContent = element.year || '未知';
        document.getElementById('elementStory').textContent = element.story || '暂无相关故事';
        
        // 移除图片和视频显示代码
        // const elementImage = document.getElementById('elementImage');
        // if (element.imageUrl) {
        //     // 设置默认图片作为备用
        //     const defaultImage = DEFAULT_ELEMENT_IMAGE + element.symbol;
        //     
        //     // 添加错误处理
        //     elementImage.onerror = function() {
        //         console.log(`图片加载失败: ${element.imageUrl}`);
        //         this.src = defaultImage;
        //     };
        //     
        //     elementImage.src = element.imageUrl;
        //     elementImage.alt = `${element.chineseName || element.name} (${element.symbol})`;
        //     elementImage.parentElement.style.display = 'block';
        // } else {
        //     // 如果没有图片，使用默认图片
        //     elementImage.src = DEFAULT_ELEMENT_IMAGE + element.symbol;
        //     elementImage.alt = `${element.chineseName || element.name} (${element.symbol})`;
        //     elementImage.parentElement.style.display = 'block';
        // }
        // 
        // // 显示元素视频（如果有）
        // const elementVideo = document.getElementById('elementVideo');
        // const videoContainer = document.getElementById('elementVideoContainer');
        // if (element.videoUrl) {
        //     elementVideo.src = element.videoUrl;
        //     videoContainer.style.display = 'block';
        //     
        //     // 添加视频加载错误处理
        //     elementVideo.onerror = function() {
        //         console.log(`视频加载失败: ${element.videoUrl}`);
        //         this.src = DEFAULT_ELEMENT_VIDEO; // 默认化学视频
        //     };
        // } else {
        //     elementVideo.src = '';
        //     videoContainer.style.display = 'none';
        // }
        
        // 显示详情面板
        document.getElementById('elementDetails').classList.add('active');
        
        // 滚动到顶部
        window.scrollTo(0, 0);
    }
    
    // 函数：更新URL以支持链接分享
    function updateUrlWithElement(element) {
        // 使用History API更新URL，不会刷新页面
        const url = new URL(window.location);
        url.searchParams.set('element', element.symbol);
        window.history.pushState({}, '', url);
    }
    
    // 函数：复制元素链接
    function copyElementLink() {
        if (!currentElement) return;
        
        const url = new URL(window.location);
        url.searchParams.set('element', currentElement.symbol);
        
        navigator.clipboard.writeText(url.toString())
            .then(() => {
                // 显示复制成功消息
                alert('链接已复制，可以分享给朋友了！');
            })
            .catch(err => {
                console.error('复制链接失败:', err);
                // 备用方案：显示链接让用户手动复制
                prompt('复制以下链接分享:', url.toString());
            });
    }
    
    // 函数：分享到微信
    function shareToWechat() {
        if (!currentElement) return;
        
        // 微信Web不能直接分享，提示用户复制链接
        alert('请复制链接，通过微信分享给朋友。');
        copyElementLink();
    }
    
    // 函数：分享到微博
    function shareToWeibo() {
        if (!currentElement) return;
        
        const url = new URL(window.location);
        url.searchParams.set('element', currentElement.symbol);
        
        const title = `我在学习元素周期表中的${currentElement.chineseName}(${currentElement.symbol})`;
        const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url.toString())}&title=${encodeURIComponent(title)}`;
        
        window.open(weiboUrl, '_blank');
    }
    
    // 函数：创建元素位置映射
    function createElementPositionsMap() {
        const positions = {};
        
        // 根据周期和族来定位元素
        elements.forEach(element => {
            if (element.period && element.group) {
                positions[`${element.period}-${element.group}`] = element.number;
            }
            
            // 特殊处理镧系和锕系元素
            if (element.category === 'lanthanide') {
                // 镧系：第6周期，族编号修改为相对位置
                positions[`8-${element.number - 54}`] = element.number;
            } else if (element.category === 'actinide') {
                // 锕系：第7周期，族编号修改为相对位置
                positions[`9-${element.number - 86}`] = element.number;
            }
        });
        
        return positions;
    }
    
    // 添加触摸设备支持
    function addTouchSupport() {
        document.body.addEventListener('touchstart', function(e) {
            if (!elementDetailsEl.contains(e.target) && 
                !e.target.classList.contains('element') &&
                elementDetailsEl.classList.contains('active')) {
                elementDetailsEl.classList.remove('active');
                // 清除视频源以停止播放
                // document.getElementById('elementVideo').src = '';
            }
        });
    }
    
    // 为触摸设备添加支持
    if ('ontouchstart' in window) {
        addTouchSupport();
    }
    
    // 适配窗口大小变化
    window.addEventListener('resize', function() {
        adjustElementSize();
    });
    
    // 调整元素大小以适应屏幕
    function adjustElementSize() {
        const elements = document.querySelectorAll('.element');
        if (window.innerWidth < 768) {
            // 移动设备适配
            elements.forEach(el => {
                el.style.fontSize = '0.7rem';
            });
        } else {
            // 重置为默认大小
            elements.forEach(el => {
                el.style.fontSize = '';
            });
        }
    }
    
    // 初始调整
    adjustElementSize();
    
    // 检查URL参数，看是否需要打开特定元素
    function checkUrlForElement() {
        const urlParams = new URLSearchParams(window.location.search);
        const elementSymbol = urlParams.get('element');
        
        if (elementSymbol) {
            // 查找匹配的元素
            const element = elements.find(el => el.symbol.toLowerCase() === elementSymbol.toLowerCase());
            if (element) {
                // 延迟一点时间，确保页面已完全加载
                setTimeout(() => {
                    showElementDetails(element);
                }, 500);
            }
        }
    }
    
    // 检查URL是否包含元素参数
    checkUrlForElement();
}); 