# cShapeSetupD::Main(..)




`cShapeSetupD`对象有一个`status`状态量，显示当前板形设定的状态（红灯或绿灯），以及判断是否合法的指示器`ok`。初始默认情况下`status`设为红灯，`ok`设为`false`。
```c++
this->status = cMdlparam::cs_red;
this->ok     = false;
```



`roll_change_count`是判断是否换辊的计数器。

```C++
int	roll_change_count (0);	
```



`redrft_perm`用于判断是否可以重新分配各机架厚度或者重新分配压下。

初始情况下`redrft_perm`设为false。

后根据如下条件更新`redrft_perm`的值。ssu_load_enab一般为false。ssu_granted一般为true。s_CalId指的是FCD对象中的Calculation ID，最小为1，最大为2。

```C++
redrft_perm =   ( true  == pcSched->pcSetupD->pcSetup->ssu_load_enab ) &&
  ( true  == pcSched->pcFSSched->pcSSys->state.ssu_granted ) &&
  ( 1 == pcSched->pcFCD->state.s_CalId );
```



`redrft_perm`的值与`iter`相同。

```c++
    if ( redrft_perm )
    {
        iter = 1;
    }
    else
    {
        iter = 0;
    }
```
在日志中的1st.iter与源码中此处`iter`并不一样。

## 短期自学习

短期自学习的设定受到换辊和钢种、规格跳档的影响。

### 跳档

针对钢种和规格的跳档，模型考虑了以下五种情况。

```
        this->family_chg         = false;
        this->narrow_to_wide_chg = false;
        this->wide_to_narrow_chg = false;
        this->prd_chg            = false;
        this->lot_chg            = false;
```

钢种族跳档、宽度由窄变宽、宽度由宽变窄，这些都好理解。

而prd_chg指的是：钢种族跳档、宽度由窄变宽、宽度由宽变窄这三种情况至少有一种出现。

```C++
        if ( (true == this->family_chg)         || 
             (true == this->narrow_to_wide_chg) || 
             (true == this->wide_to_narrow_chg) )
        {
            this->prd_chg = true;
        }
```

lot_chg指的是和前一块带钢相比，钢种族、厚度索引、宽度索引其中至少一者发生改变，则称为lot_chg。

```C++
if (  // family change
    ((pcSched->pcFSSched->pcSAMP->state.pr_family > 0) &&
    (abs(pcSched->pcPDI->state.family - pcSched->pcFSSched->pcSAMP->state.pr_family) > 0)) ||
    // gauge range table index change
    ((pcSched->pcFSSched->pcSAMP->state.pr_grt_idx > 0) &&
    (abs(pcSched->pcPDI->state.grt_idx - pcSched->pcFSSched->pcSAMP->state.pr_grt_idx) > 0)) ||
    // width range table index change
    ((pcSched->pcFSSched->pcSAMP->state.pr_wrt_idx > 0) &&
    (abs(pcSched->pcPDI->state.wrt_idx - pcSched->pcFSSched->pcSAMP->state.pr_wrt_idx) > 0)) )
{
    this->lot_chg = true;
}
```

### 短期自学习预设定

根据是否跳档以及换辊，短期自学习在开始进行设定设定计算前，更新凸度和平直度的自学习。所谓的预设定其实是在不同的条件下清零自学习。

- 当有机架换辊，则累积增加相应机架的换辊次数num_rolls_chgd。
- 若超过两个机架换辊，则清零凸度自学习与平直度自学习（vrn和err），并更新辊形自学习，同时更换轧辊的相应道次清零弯辊力补偿。
- 当出现lot_chg，清零弯辊力补偿以及bnd_ofs_counter。
- 当出现钢种族跳档，则清零凸度自学习（vrn和err）。
- 如果出现窄到宽的跳档，同时周期内轧制块数超过30块，并且存在中浪趋势，则清零平直度自学习（vrn和err），若辊形自学习也小于零，则清零辊形自学习wr_crn_vrn。
- 若出现宽到窄的跳档，不做任何设定修改。

更新完短期自学习表之后，并且当前计算阶段处于course-2之后，则put短期自学习表到模型数据库（models database）。

## cShapeSetupD::Init(..)

cShapeSetupD::Init(..)初始化了动态的SHAPESETUP对象以及其它相关的动态对象，比如：LPCE, LRG, UFD, and TARGT。除此之外，这个函数还计算了执行机构的软极限，同时复制外部的数据给合适的动态对象。

cShapeSetupD::Init(..)初始化之后，最初的哪两个状态布尔值更新为true。

```C++
    this->ok     = true;
    this->status = cMdlparam::cs_green;
```
cShapeSetupD::Init(..)的实现在shapesetup_req.cxx文件中。

### 长短期自学习初始化

模型用prf_vrn_sel_flag和flt_vrn_sel_flag这两个参数来标识

## cShapeSetupD::References(..)

cShapeSetupD::References(..)计算了凸度与平直度控制目标下的相关设定值，必要情况下重新分配轧制力或压下。