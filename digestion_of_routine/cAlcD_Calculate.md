# cAlcD::Calculate(..)

凸度分配计算。

## Delvry_Pass(..)之前

cAlcD::Calculate(..)开始时，首先赋值中间坯的“分配厚度”。中间坯的“分配厚度”实际为F1的入口厚度，即中间坯的实际厚度。之后计算F1到F7的单位轧制力、分配厚度，以及引用轧辊咬入相关的对象。

如果可以重新分配压下，那么还会计算轧制力的最大改变量。

之后计算总的单位凸度改变量pu_prf_change_sum。

```C++
pu_prf_change_sum += pcFSPassDtmp->pcEvlLPceD[ iter ]->strn_rlf_cof
                  / (pcFSPassDtmp->pcFSStdD[ iter ]->pcLRGD->pce_infl_cof
                  * pcFSPassDtmp->pcEvlLPceD[ iter ]->elas_modu);
```
或者表示为：
$$
pu\_prf\_change\_sum = \sum_{i=1}^{7} (\frac{strn\_rlf\_cof}{pce\_infl\_cof}\cdot elas\_modu)
$$

## Delvry_Pass(..)

Delvry_Pass(..)计算F7或最后一非空过道次的入口和出口有效单位凸度，以及出口istd应变差。

计算流程如下图所示。

![Delvry_Pass_Diagram](cAlcD_Calculate/Delvry_Pass_Diagram.png)

基础量是加了操作工补偿和凸度自学习的单位凸度pu_prf。由pu_prf_env限幅。

首先将pu_prf直接赋值给最后一道次（F7）入口有效单位凸度ef_en_pu_prf。

之后将F7的ef_en_pu_prf直接赋值给F1到F6的入口有效单位凸度ef_en_pu_prf，并由各个道次的ef_pu_prf_env限幅。这是先假设所有机架单位凸度相同，理想状态下的情况。

回到F7，用Std_Ex_strn5计算末道次的机架出口应变差std_ex_strn，并用中浪和边浪的判别极限Crit_Bckl_Lim限幅。在判别极限中，中浪对应负值，边浪对应正值。限幅操作的意义是看std_ex_strn是否超出判别极限，若超出则一定会出现浪形，则当前std_ex_strn的值肯定不合适，需要重新计算，但是std_ex_strn的值依赖ef_en_pu_prf。因此，通过函数Ef_En_PU_Prf5，利用限幅后的std_ex_strn和目标pu_prf重计算F7的ef_en_pu_prf。

接着利用新的std_ex_strn计算F7的ufd_pu_prf_buf。同样在限幅时，若发现当前的ufd_pu_prf_buf不合适，需要重新计算。但是ufd_pu_prf的计算依赖于之前的std_ex_strn、ef_en_pu_prf计算结果，因此必须对这两个值重新计算。

最后，我们有重新计算的std_ex_strn、ef_en_pu_prf值。即可通过新的std_ex_strn值，计算出F7的出口istd应变差。利用新的ef_en_pu_prf和ufd_pu_prf_buf计算出F7的出口有效单位凸度ef_ex_pu_prf。

注意在Delvry_Pass(..)中的均载辊缝凸度只是作为中间计算结果存在，与后面分配阶段的ufd_pu_prf有所区别。

## 空过的分配处理

分配从F7或末道次机架，从后往前倒者来。

若非末道次的机架空过，则

