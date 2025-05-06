document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const periodicTableEl = document.getElementById('periodicTable');
    const elementDetailsEl = document.getElementById('elementDetails');
    const closeBtn = document.getElementById('closeDetails');
    
    // 元素表格布局数据：行、列坐标
    const elementPositions = createElementPositionsMap();
    
    // 生成周期表
    generatePeriodicTable();
    
    // 绑定关闭按钮事件
    closeBtn.addEventListener('click', function() {
        elementDetailsEl.classList.remove('active');
    });
    
    // 函数：生成周期表
    function generatePeriodicTable() {
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
                    `;
                    
                    // 添加点击事件
                    cell.addEventListener('click', function() {
                        showElementDetails(element);
                    });
                }
                
                // 将单元格添加到周期表
                periodicTableEl.appendChild(cell);
            }
        }
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
        // 填充详情
        document.getElementById('elementName').textContent = element.chineseName || element.name;
        document.getElementById('elementSymbol').textContent = element.symbol;
        document.getElementById('elementSymbol').className = `element-symbol ${element.category}`;
        document.getElementById('elementNumber').textContent = element.number;
        document.getElementById('elementWeight').textContent = element.weight;
        document.getElementById('elementDiscoverer').textContent = element.discoverer;
        document.getElementById('elementYear').textContent = element.year;
        document.getElementById('elementStory').textContent = element.story;
        
        // 显示元素图片（如果有）
        const elementImage = document.getElementById('elementImage');
        if (element.imageUrl) {
            elementImage.src = element.imageUrl;
            elementImage.parentElement.style.display = 'block';
        } else {
            elementImage.src = '';
            elementImage.parentElement.style.display = 'none';
        }
        
        // 显示元素视频（如果有）
        const elementVideo = document.getElementById('elementVideo');
        const videoContainer = document.getElementById('elementVideoContainer');
        if (element.videoUrl) {
            elementVideo.src = element.videoUrl;
            videoContainer.style.display = 'block';
        } else {
            elementVideo.src = '';
            videoContainer.style.display = 'none';
        }
        
        // 显示详情面板
        elementDetailsEl.classList.add('active');
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
}); 