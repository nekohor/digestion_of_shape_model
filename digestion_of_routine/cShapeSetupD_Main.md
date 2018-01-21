# cShapeSetupD::Main(..)




cShapeSetupD对象有一个status状态量，显示当前板形设定的状态（红灯或绿灯），以及判断是否合法的指示器ok。初始默认情况下status设为红灯，ok设为false。
```c
this->status = cMdlparam::cs_red;
this->ok     = false;
```
roll_change_count是判断是否换辊的计数器。

```c
int	roll_change_count (0);	
```


redrft_perm用于判断是否可以重新分配各机架厚度或者重新分配压下。初始情况下redrft_perm设为false。

后根据如下条件更新redrft_perm的值。ssu_load_enab一般为false。ssu_granted一般为true。s_CalId指的是FCD对象中的Calculation ID，最小为1，最大为2。

```c
redrft_perm =   ( true  == pcSched->pcSetupD->pcSetup->ssu_load_enab ) &&
  ( true  == pcSched->pcFSSched->pcSSys->state.ssu_granted ) &&
  ( 1 == pcSched->pcFCD->state.s_CalId );
```

redrft_perm的值与iter相同。

```c
    if ( redrft_perm )
    {
        iter = 1;
    }
    else
    {
        iter = 0;
    }
```
在日志中的1st.iter与源码中此处iter并不一样。

## 短期自学习

短期自学习的设定受到换辊和钢种、规格跳档的影响。

### 跳档

针对钢种和规格的跳档，模型考虑了以下五种情况。

```c
this->family_chg         = false;
this->narrow_to_wide_chg = false;
this->wide_to_narrow_chg = false;
this->prd_chg            = false;
this->lot_chg            = false;
```

钢种族跳档、宽度由窄变宽、宽度由宽变窄，这些都好理解。

而prd_chg指的是：钢种族跳档、宽度由窄变宽、宽度由宽变窄这三种情况至少有一种出现。

```c
if ( (true == this->family_chg)         || 
    (true == this->narrow_to_wide_chg) || 
    (true == this->wide_to_narrow_chg) )
{
  this->prd_chg = true;
}
```

lot_chg指的是和前一块带钢相比，钢种族、厚度索引、宽度索引其中至少一者发生改变，则称为lot_chg。

```c
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

cShapeSetupD::Init(..)初始化了动态的SHAPESETUP对象以及其它相关的动态对象，比如：LPCE、LRG、UFD和TARGT。除此之外，这个函数还计算了执行机构的软极限，同时复制外部的数据给合适的动态对象。

cShapeSetupD::Init(..)初始化之后，最初的哪两个状态布尔值更新为true。

```c
this->ok     = true;
this->status = cMdlparam::cs_green;
```
cShapeSetupD::Init(..)的实现在shapesetup_req.cxx文件中。

### 长短期自学习初始化

首先初始化凸度和平直度的目标tgt_profile和tgt_flatness。这两个目标一开始是PDI目标加上操作工的补偿。

模型用prf_vrn_sel_flag和flt_vrn_sel_flag这两个参数来标识长短期自学习的选择，默认以长期自学习为主。初始的凸度或平直度自学习为长期自学习，当这一块带钢和上一块带钢相比，出现钢种或规格跳档，则将长期自学习加上上一块增益后的短期自学习，作为新的凸度自学习prf_vrn_rm_tmp和prf_vrn_rs_tmp；以及平直度自学习flt_vrn_tmp。

### cTargtD::Init(..)

在cTargtD::Init(..)中主要确定初始的凸度以及目标有效凸度的极限。prf_vrn是prf_vrn_rm_tmp和prf_vrn_rs_tmp的差，flt_vrn就是flt_vrn_tmp。

目标flt为pdi平直度目标加上平直度的操作工补偿。

初始目标凸度与平直度稍有差别。

```c
 prf_int = (pdi_prf + prf_op_off) * matl_exp_cof + prf_vrn;
```

prf_int为pdi凸度加上操作工补偿后的热态凸度，再加上凸度自学习量。也就是说，凸度自学习量是补偿热态下的凸度。

之后用凸度的容许偏差计算单位凸度的上下极限。

### 初始化的大循环

pcTargtD->Init(..)执行完之后，从首道次机架从前往后进行一系列的初始化工作，将近700行代码。

首先将sprp的相关调整系数初始化到相应的对象中（pcFSStdD），供后续板形计算使用，如ufd_mult和force_bnd_nom。

对非空道次计算出入口厚度对轧制力的偏导数或增益DForce_DEnthick、DForce_DExthick。之后初始化板形相关的动态对象，按先后顺序分别为UFD对象、CRLC对象和LRG对象。

注意在CRLC对象的初始化中，SPRP中的工作辊凸度补偿f_wr_crn_off_adj需要加到长期自学习工作辊凸度补偿psSLFG->wr_crn_off上。

f_wr_crn_off_adj的设定根据出口凸度分为三档。

```c
float f_wr_crn_off_adj = 0.0F;
if ( pcTargtD->prf_del < 0.045F )
{
    f_wr_crn_off_adj = psSPRP->wr_crn_off_adj [ passIdx ] ;
}
else if ( pcTargtD->prf_del < 0.065F )
{
    f_wr_crn_off_adj = psSPRP->wr_crn_off_adj2 [ passIdx ];
}
else
{
    f_wr_crn_off_adj = psSPRP->wr_crn_off_adj3 [ passIdx ] ;
}
```



## cShapeSetupD::References(..)

cShapeSetupD::References(..)计算了凸度与平直度控制目标下的相关设定值，必要情况下重新分配轧制力或压下。