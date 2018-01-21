# ALC模块重难点问题

分配过程与分配模块内的重点和难点问题的说明。

## pcPceIZFSPassD

pcPceIZFSPassD是板形模型中用来标识带钢影响系数为0的道次的指针。

```c
pcPceIZFSPassD = ( cFSPassD* )pcFstFSPassD->previous_obj;

const cFSPassD* pcFSPassD = pcFstFSPassD;

while ( pcFSPassD != NULL )
{
    // ...
    if ( pcFSPassD->pcFSStdD[ iter ]->pcLRGD->pce_infl_cof <= 0.0 )
    {
        pcPceIZFSPassD = pcFSPassD;
    }
    // ...
    pcFSPassD = ( cFSPassD* )pcFSPassD->next_obj;
}
```

首先预设定pcPceIZFSPassD为pass0。之后一个循环，从F1到F7找到带钢影响系数为非正数的道次，用pcPceIZFSPassD指向这个道次。

一般说来，带钢影响系数从F1到F7是逐渐增大的，意味着从F1到F7不均匀变形是逐渐增大逐渐严重的过程（宽厚比增加）。所以设置pcPceIZFSPassD的意义在于：F1到F7若上游机架存在均匀变形，则找到均匀变形的上游机架和不均匀变形的下游机架之间的分界点。那么在`start_over == true`的流程中，ef_en_pu_prf还要受到pcPceIZFSPassD道次的包络线约束。

## 凸度最终修正的说明

为化简情形，设当前板形满足以下条件：

- 各个机架或道次的带钢影响系数均不为0。
- 各个机架的包络线区间富余量足够大，能够包含死区极限。

那么整个凸度分配的

